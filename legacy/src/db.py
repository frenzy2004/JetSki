"""
Database module for JetSki
Stores video analysis results, storyboards, and generation history
"""

import sqlite3
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List

# Database file location
DB_PATH = Path(__file__).parent.parent / "data" / "jetski.db"

def init_db():
    """Initialize database with required tables"""
    DB_PATH.parent.mkdir(exist_ok=True)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Videos table - stores video metadata and analysis
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            video_url TEXT UNIQUE NOT NULL,
            video_id TEXT NOT NULL,
            title TEXT,
            duration INTEGER,
            transcript TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Viral segments table - stores detected viral moments
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS viral_segments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            video_id INTEGER NOT NULL,
            rank INTEGER NOT NULL,
            score INTEGER NOT NULL,
            start_time TEXT,
            end_time TEXT,
            viral_type TEXT,
            hook TEXT,
            summary TEXT,
            transcript_excerpt TEXT,
            is_selected BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (video_id) REFERENCES videos(id)
        )
    """)

    # Storyboards table - stores generated storyboards
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS storyboards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            video_id INTEGER NOT NULL,
            segment_id INTEGER NOT NULL,
            title TEXT,
            style TEXT,
            tone TEXT,
            panels_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (video_id) REFERENCES videos(id),
            FOREIGN KEY (segment_id) REFERENCES viral_segments(id)
        )
    """)

    # Generated comics table - stores final outputs
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS generated_comics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            storyboard_id INTEGER NOT NULL,
            images_json TEXT,
            google_doc_url TEXT,
            drive_folder_url TEXT,
            generation_time_seconds REAL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (storyboard_id) REFERENCES storyboards(id)
        )
    """)

    # Metrics table - track performance
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            video_id INTEGER NOT NULL,
            step TEXT NOT NULL,
            duration_seconds REAL NOT NULL,
            success BOOLEAN DEFAULT 1,
            error_message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (video_id) REFERENCES videos(id)
        )
    """)

    conn.commit()
    conn.close()


def save_video(video_url: str, video_id: str, title: str = None,
               duration: int = None, transcript: str = None) -> int:
    """Save video metadata to database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO videos (video_url, video_id, title, duration, transcript)
            VALUES (?, ?, ?, ?, ?)
        """, (video_url, video_id, title, duration, transcript))

        video_pk = cursor.lastrowid
        conn.commit()
        return video_pk
    except sqlite3.IntegrityError:
        # Video already exists, get its ID
        cursor.execute("SELECT id FROM videos WHERE video_url = ?", (video_url,))
        video_pk = cursor.fetchone()[0]
        return video_pk
    finally:
        conn.close()


def save_viral_segments(video_pk: int, segments: List[Dict], selected_rank: int):
    """Save viral segment analysis to database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for segment in segments:
        cursor.execute("""
            INSERT INTO viral_segments
            (video_id, rank, score, start_time, end_time, viral_type,
             hook, summary, transcript_excerpt, is_selected)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            video_pk,
            segment.get('rank'),
            segment.get('score'),
            segment.get('start_time'),
            segment.get('end_time'),
            segment.get('viral_type'),
            segment.get('hook'),
            segment.get('summary'),
            segment.get('transcript_excerpt'),
            1 if segment.get('rank') == selected_rank else 0
        ))

    conn.commit()

    # Return ID of selected segment
    cursor.execute("""
        SELECT id FROM viral_segments
        WHERE video_id = ? AND rank = ?
    """, (video_pk, selected_rank))

    segment_id = cursor.fetchone()[0]
    conn.close()
    return segment_id


def save_storyboard(video_pk: int, segment_id: int, storyboard_data: Dict) -> int:
    """Save storyboard to database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO storyboards
        (video_id, segment_id, title, style, tone, panels_json)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        video_pk,
        segment_id,
        storyboard_data.get('title'),
        storyboard_data.get('style'),
        storyboard_data.get('tone'),
        json.dumps(storyboard_data.get('panels', []))
    ))

    storyboard_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return storyboard_id


def save_generated_comic(storyboard_id: int, images_data: Optional[Dict] = None,
                         google_doc_url: str = None, drive_folder_url: str = None,
                         generation_time: float = None, status: str = "success") -> int:
    """Save final generated comic results"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO generated_comics
        (storyboard_id, images_json, google_doc_url, drive_folder_url,
         generation_time_seconds, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        storyboard_id,
        json.dumps(images_data) if images_data else None,
        google_doc_url,
        drive_folder_url,
        generation_time,
        status
    ))

    comic_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return comic_id


def log_metric(video_pk: int, step: str, duration: float,
               success: bool = True, error: str = None):
    """Log performance metric for a pipeline step"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO metrics (video_id, step, duration_seconds, success, error_message)
        VALUES (?, ?, ?, ?, ?)
    """, (video_pk, step, duration, success, error))

    conn.commit()
    conn.close()


def get_video_history(limit: int = 10) -> List[Dict]:
    """Get recent video processing history"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            v.id,
            v.video_url,
            v.title,
            v.created_at,
            COUNT(DISTINCT vs.id) as segments_count,
            COUNT(DISTINCT s.id) as storyboards_count,
            COUNT(DISTINCT gc.id) as comics_count
        FROM videos v
        LEFT JOIN viral_segments vs ON v.id = vs.video_id
        LEFT JOIN storyboards s ON v.id = s.video_id
        LEFT JOIN generated_comics gc ON s.id = gc.storyboard_id
        GROUP BY v.id
        ORDER BY v.created_at DESC
        LIMIT ?
    """, (limit,))

    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results


def get_video_by_url(video_url: str) -> Optional[Dict]:
    """Get video data by URL"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM videos WHERE video_url = ?", (video_url,))
    row = cursor.fetchone()
    conn.close()

    return dict(row) if row else None


# Initialize database on module import
init_db()
