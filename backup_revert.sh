#!/bin/bash

# Set the paths and variables
BACKUP_DIR="/home/iandev/backups"  # Your backup directory
GIT_BACKUP_BRANCH="backup-branch"
MONGO_DB_NAME="ratemyclinic"  # Your MongoDB database name for the app

# Function to backup the Git code (commit to a backup branch)
backup_git() {
  echo "Backing up Git repository..."

  # Check if we're on the backup branch already
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [ "$CURRENT_BRANCH" != "$GIT_BACKUP_BRANCH" ]; then
    echo "Switching to backup branch..."
    git checkout -b "$GIT_BACKUP_BRANCH"  # Create backup branch if it doesn't exist
  fi
  
  # Add all files and commit the backup
  git add .
  git commit -m "Backup: Save current state"
  git push --set-upstream origin "$GIT_BACKUP_BRANCH"
  echo "Git backup completed!"
}

# Function to backup MongoDB
backup_mongo() {
  echo "Backing up MongoDB database: $MONGO_DB_NAME..."
  
  # Use mongodump to create the backup
  mongodump --db "$MONGO_DB_NAME" --out "$BACKUP_DIR/mongo/ratemyclinic_db_backup-$(date +'%Y-%m-%d')"
  echo "MongoDB backup completed!"
}

# Function to revert Git to the backup branch
revert_git() {
  echo "Reverting Git to the backup branch..."

  # Checkout the backup branch and reset the current state
  git checkout "$GIT_BACKUP_BRANCH"
  git pull origin "$GIT_BACKUP_BRANCH"
  echo "Git reverted to backup branch!"
}

# Function to revert MongoDB from the backup
revert_mongo() {
  echo "Reverting MongoDB from backup..."
  
  # Use mongorestore to restore the backup (change path as needed)
  mongorestore --drop "$BACKUP_DIR/mongo/ratemyclinic_db_backup-$(date +'%Y-%m-%d')"
  echo "MongoDB reverted from backup!"
}

# Main Menu
echo "Choose an option:"
echo "1) Backup Git and MongoDB"
echo "2) Revert Git from Backup"
echo "3) Revert MongoDB from Backup"
echo "4) Exit"
read -p "Enter your choice [1-4]: " CHOICE

case $CHOICE in
  1)
    backup_git
    backup_mongo
    ;;
  2)
    revert_git
    ;;
  3)
    revert_mongo
    ;;
  4)
    echo "Exiting..."
    exit 0
    ;;
  *)
    echo "Invalid choice! Exiting..."
    exit 1
    ;;
esac
