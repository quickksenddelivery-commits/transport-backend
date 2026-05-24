---
name: feedback_test_folder
description: Always place test files in the tests/ folder, never in the project root
metadata:
  type: feedback
---

Always create test files inside the `tests/` folder (e.g. `tests/test-email.js`), never in the project root.

**Why:** User preference for keeping the project root clean and tests organized.

**How to apply:** Any time a test script or one-off test file is created, place it under `tests/` and create the folder if it doesn't exist yet.
