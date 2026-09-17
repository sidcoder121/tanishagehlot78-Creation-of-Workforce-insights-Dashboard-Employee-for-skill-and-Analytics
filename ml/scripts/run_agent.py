import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from app.agent import run_weekly_agent

if __name__ == "__main__":
    run_weekly_agent()
