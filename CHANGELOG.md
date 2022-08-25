# Changelog

### Year 3 (Fall 2021 - Spring 2022)

* User Engagement
  * Remove pre-assessment and daily assessment from user's view
  * Add push notifications to remind users to play the game
  * Add leaderboard with username support
  * Add password reset system
* Functional Tweaks
  * Perform package upgrade
  * Add some robustness to the database initialization code
  * Change public/secret token keys to be base64 encoded within environment variables.
    * This was done to help alleviate formatting issues within Heroku.
* Gamification
  * Create leaderboard
* Development Ease
  * Create CHANGELOG
  * Create docker-compose file for local testing
  * Create staging environment
  * Automate deployment to staging environment
