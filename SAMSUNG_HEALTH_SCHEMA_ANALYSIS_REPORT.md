# Samsung Health Schema Analysis Report

Privacy note: this report was produced by local inspection only. The export root name and all identifiers are masked. Raw personal values, device IDs, file UUIDs, locations, and free-text fields are not included.

# 1. Executive Summary

This appears to be a Samsung Health personal data export generated on `2026-05-23 10:33:46` from an extracted folder plus its original ZIP. The export contains `55` top-level CSV tables, `16732` JSON sidecar files, and `41` JPG files. The CSVs use a consistent Samsung layout: line 1 is table metadata, line 2 is the real header, and line 3 onward is data.

The broad parsed timestamp coverage is `2025-08-15` to `2026-05-23`. Strong dashboard categories are steps/activity, heart rate, sleep, exercise/workouts, blood oxygen, calories/activity, and body metrics. Nutrition and water exist but are sparse. Blood pressure, ECG, and menstrual cycle data were not detected.

The data is sufficient for a meaningful local dashboard and doctor-friendly trend report, especially for activity, sleep, heart rate, SpO2, and workouts. Major limitations are sparse nutrition/water/stress manual entries, many JSON detail blobs requiring sidecar joins, local timezone assumptions, and no explicit clinical context or symptom log in the export.

# 2. ZIP / Folder Structure

```text
- [EXPORT_ROOT]/ (16828 files, 200.65 MiB extracted)
  - *.csv (55 files)
    - com.samsung.health.device_profile.20260523103346.csv (2.0 KiB, 8 rows)
    - com.samsung.health.floors_climbed.20260523103346.csv (453.0 KiB, 1932 rows)
    - com.samsung.health.food_info.20260523103346.csv (3.1 KiB, 9 rows)
    - com.samsung.health.food_intake.20260523103346.csv (16.5 KiB, 73 rows)
    - com.samsung.health.height.20260523103346.csv (891 B, 4 rows)
    - com.samsung.health.hrv.20260523103346.csv (436.9 KiB, 1740 rows)
    - com.samsung.health.movement.20260523103346.csv (1.30 MiB, 5309 rows)
    - com.samsung.health.nutrition.20260523103346.csv (20.1 KiB, 67 rows)
    - com.samsung.health.oxygen_saturation.raw.20260523103346.csv (10.7 KiB, 45 rows)
    - com.samsung.health.respiratory_rate.20260523103346.csv (109.6 KiB, 375 rows)
    - com.samsung.health.sleep_stage.20260523103346.csv (6.45 MiB, 27703 rows)
    - com.samsung.health.user_profile.20260523103346.csv (3.6 KiB, 21 rows)
    - com.samsung.health.water_intake.20260523103346.csv (534 B, 2 rows)
    - com.samsung.health.weight.20260523103346.csv (2.1 KiB, 8 rows)
    - com.samsung.shealth.activity.day_summary.20260523103346.csv (100.9 KiB, 310 rows)
    - com.samsung.shealth.activity_level.20260523103346.csv (469 B, 2 rows)
    - com.samsung.shealth.badge.20260523103346.csv (33.1 KiB, 145 rows)
    - com.samsung.shealth.best_records.20260523103346.csv (1.7 KiB, 9 rows)
    - com.samsung.shealth.breathing.20260523103346.csv (682 B, 2 rows)
    - com.samsung.shealth.calories_burned.details.20260523103346.csv (69.4 KiB, 283 rows)
    - com.samsung.shealth.exercise.20260523103346.csv (288.3 KiB, 586 rows)
    - com.samsung.shealth.exercise.extension.20260523103346.csv (1.8 KiB, 10 rows)
    - com.samsung.shealth.exercise.periodization_training_program.20260523103346.csv (863 B, 3 rows)
    - com.samsung.shealth.exercise.periodization_training_schedule.20260523103346.csv (502 B, 1 rows)
    - com.samsung.shealth.exercise.recovery_heart_rate.20260523103346.csv (11.8 KiB, 41 rows)
    - com.samsung.shealth.exercise.weather.20260523103346.csv (583 B, 1 rows)
    - com.samsung.shealth.food_favorite.20260523103346.csv (4.3 KiB, 18 rows)
    - com.samsung.shealth.food_frequent.20260523103346.csv (1.7 KiB, 8 rows)
    - com.samsung.shealth.food_image.20260523103346.csv (8.6 KiB, 40 rows)
    - com.samsung.shealth.hsp.references.20260523103346.csv (1.60 MiB, 8176 rows)
    - com.samsung.shealth.insight_message.20260523103346.csv (44.4 KiB, 70 rows)
    - com.samsung.shealth.mindfulness.history.20260523103346.csv (765 B, 2 rows)
    - com.samsung.shealth.mood.20260523103346.csv (816 B, 3 rows)
    - com.samsung.shealth.preferences.20260523103346.csv (11.3 KiB, 77 rows)
    - com.samsung.shealth.program.sleep_coaching.mission.20260523103346.csv (62.3 KiB, 315 rows)
    - com.samsung.shealth.program.sleep_coaching.session.20260523103346.csv (740 B, 2 rows)
    - com.samsung.shealth.service_preferences.20260523103346.csv (3.7 KiB, 17 rows)
    - com.samsung.shealth.sleep.20260523103346.csv (144.7 KiB, 392 rows)
    - com.samsung.shealth.sleep_combined.20260523103346.csv (27.3 KiB, 83 rows)
    - com.samsung.shealth.sleep_goal.20260523103346.csv (354 B, 1 rows)
    - com.samsung.shealth.sleep_raw_data.20260523103346.csv (2.2 KiB, 9 rows)
    - com.samsung.shealth.social.public_challenge.20260523103346.csv (304 B, 1 rows)
    - com.samsung.shealth.social.public_challenge.detail.20260523103346.csv (346 B, 1 rows)
    - com.samsung.shealth.social.public_challenge.history.20260523103346.csv (352 B, 1 rows)
    - com.samsung.shealth.social.service_status.20260523103346.csv (645 B, 4 rows)
    - com.samsung.shealth.step_daily_trend.20260523103346.csv (185.4 KiB, 736 rows)
    - com.samsung.shealth.stress.20260523103346.csv (2.5 KiB, 11 rows)
    - com.samsung.shealth.stress.histogram.20260523103346.csv (714 B, 3 rows)
    - com.samsung.shealth.tracker.floors_day_summary.20260523103346.csv (51.2 KiB, 241 rows)
    - com.samsung.shealth.tracker.heart_rate.20260523103346.csv (2.63 MiB, 11580 rows)
    - com.samsung.shealth.tracker.oxygen_saturation.20260523103346.csv (116.9 KiB, 370 rows)
    - com.samsung.shealth.tracker.pedometer_day_summary.20260523103346.csv (265.9 KiB, 737 rows)
    - com.samsung.shealth.tracker.pedometer_step_count.20260523103346.csv (1.74 MiB, 8168 rows)
    - com.samsung.shealth.vitality.nap_data.20260523103346.csv (7.2 KiB, 31 rows)
    - com.samsung.shealth.vitality_score.20260523103346.csv (141.5 KiB, 229 rows)
  - jsons/ (16732 JSON files)
    - com.samsung.health.device_profile/... (4 JSON, 59.3 KiB)
    - com.samsung.health.floors_climbed/... (1932 JSON, 115.0 KiB)
    - com.samsung.health.hrv/... (1740 JSON, 6.31 MiB)
    - com.samsung.health.movement/... (5309 JSON, 21.68 MiB)
    - com.samsung.health.oxygen_saturation.raw/... (45 JSON, 31.36 MiB)
    - com.samsung.health.respiratory_rate/... (375 JSON, 7.43 MiB)
    - com.samsung.health.user_profile/... (1 JSON, 6.4 KiB)
    - com.samsung.shealth.activity.day_summary/... (310 JSON, 2.98 MiB)
    - com.samsung.shealth.calories_burned.details/... (283 JSON, 65.5 KiB)
    - com.samsung.shealth.exercise/... (1505 JSON, 44.30 MiB)
    - com.samsung.shealth.exercise.periodization_training_program/... (3 JSON, 2.05 MiB)
    - com.samsung.shealth.exercise.periodization_training_schedule/... (1 JSON, 22.2 KiB)
    - com.samsung.shealth.exercise.recovery_heart_rate/... (41 JSON, 171.5 KiB)
    - com.samsung.shealth.preferences/... (5 JSON, 79.0 KiB)
    - com.samsung.shealth.program.sleep_coaching.session/... (2 JSON, 88 B)
    - com.samsung.shealth.service_preferences/... (1 JSON, 24 B)
    - com.samsung.shealth.sleep_raw_data/... (9 JSON, 2.25 MiB)
    - com.samsung.shealth.social.public_challenge/... (1 JSON, 2.5 KiB)
    - com.samsung.shealth.social.public_challenge.detail/... (1 JSON, 6.4 KiB)
    - com.samsung.shealth.social.public_challenge.history/... (1 JSON, 44 B)
    - com.samsung.shealth.step_daily_trend/... (736 JSON, 6.42 MiB)
    - com.samsung.shealth.stress.histogram/... (3 JSON, 361 B)
    - com.samsung.shealth.tracker.floors_day_summary/... (241 JSON, 68.0 KiB)
    - com.samsung.shealth.tracker.heart_rate/... (2086 JSON, 11.01 MiB)
    - com.samsung.shealth.tracker.oxygen_saturation/... (370 JSON, 4.48 MiB)
    - com.samsung.shealth.tracker.pedometer_day_summary/... (1727 JSON, 19.70 MiB)
  - files/
    - com.samsung.health.user_profile/ (1 JPG profile image, not parsed)
    - com.samsung.shealth.food_image/ (40 JPG meal images, not parsed)
- [EXPORT_ROOT].zip (50.26 MiB, 17111 ZIP entries)
```

| File path | File type | Size | Estimated row count | Parsed | Useful health data |
|---|---:|---:|---:|---|---|
| `[EXPORT_ROOT]/com.samsung.health.device_profile.20260523103346.csv` | CSV | 2.0 KiB | 8 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.health.floors_climbed.20260523103346.csv` | CSV | 453.0 KiB | 1932 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.health.food_info.20260523103346.csv` | CSV | 3.1 KiB | 9 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.health.food_intake.20260523103346.csv` | CSV | 16.5 KiB | 73 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.health.height.20260523103346.csv` | CSV | 891 B | 4 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.health.hrv.20260523103346.csv` | CSV | 436.9 KiB | 1740 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.health.movement.20260523103346.csv` | CSV | 1.30 MiB | 5309 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.health.nutrition.20260523103346.csv` | CSV | 20.1 KiB | 67 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.health.oxygen_saturation.raw.20260523103346.csv` | CSV | 10.7 KiB | 45 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.health.respiratory_rate.20260523103346.csv` | CSV | 109.6 KiB | 375 | Yes | Low/no |
| `[EXPORT_ROOT]/com.samsung.health.sleep_stage.20260523103346.csv` | CSV | 6.45 MiB | 27703 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.health.user_profile.20260523103346.csv` | CSV | 3.6 KiB | 21 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.health.water_intake.20260523103346.csv` | CSV | 534 B | 2 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.health.weight.20260523103346.csv` | CSV | 2.1 KiB | 8 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.activity.day_summary.20260523103346.csv` | CSV | 100.9 KiB | 310 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.activity_level.20260523103346.csv` | CSV | 469 B | 2 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.badge.20260523103346.csv` | CSV | 33.1 KiB | 145 | Yes | Low/no |
| `[EXPORT_ROOT]/com.samsung.shealth.best_records.20260523103346.csv` | CSV | 1.7 KiB | 9 | Yes | Low/no |
| `[EXPORT_ROOT]/com.samsung.shealth.breathing.20260523103346.csv` | CSV | 682 B | 2 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.calories_burned.details.20260523103346.csv` | CSV | 69.4 KiB | 283 | Yes | Low/no |
| `[EXPORT_ROOT]/com.samsung.shealth.exercise.20260523103346.csv` | CSV | 288.3 KiB | 586 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.exercise.extension.20260523103346.csv` | CSV | 1.8 KiB | 10 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.exercise.periodization_training_program.20260523103346.csv` | CSV | 863 B | 3 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.exercise.periodization_training_schedule.20260523103346.csv` | CSV | 502 B | 1 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.exercise.recovery_heart_rate.20260523103346.csv` | CSV | 11.8 KiB | 41 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.exercise.weather.20260523103346.csv` | CSV | 583 B | 1 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.food_favorite.20260523103346.csv` | CSV | 4.3 KiB | 18 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.food_frequent.20260523103346.csv` | CSV | 1.7 KiB | 8 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.food_image.20260523103346.csv` | CSV | 8.6 KiB | 40 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.hsp.references.20260523103346.csv` | CSV | 1.60 MiB | 8176 | Yes | Low/no |
| `[EXPORT_ROOT]/com.samsung.shealth.insight_message.20260523103346.csv` | CSV | 44.4 KiB | 70 | Yes | Low/no |
| `[EXPORT_ROOT]/com.samsung.shealth.mindfulness.history.20260523103346.csv` | CSV | 765 B | 2 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.mood.20260523103346.csv` | CSV | 816 B | 3 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.preferences.20260523103346.csv` | CSV | 11.3 KiB | 77 | Yes | Low/no |
| `[EXPORT_ROOT]/com.samsung.shealth.program.sleep_coaching.mission.20260523103346.csv` | CSV | 62.3 KiB | 315 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.program.sleep_coaching.session.20260523103346.csv` | CSV | 740 B | 2 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.service_preferences.20260523103346.csv` | CSV | 3.7 KiB | 17 | Yes | Low/no |
| `[EXPORT_ROOT]/com.samsung.shealth.sleep.20260523103346.csv` | CSV | 144.7 KiB | 392 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.sleep_combined.20260523103346.csv` | CSV | 27.3 KiB | 83 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.sleep_goal.20260523103346.csv` | CSV | 354 B | 1 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.sleep_raw_data.20260523103346.csv` | CSV | 2.2 KiB | 9 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.social.public_challenge.20260523103346.csv` | CSV | 304 B | 1 | Yes | Low/no |
| `[EXPORT_ROOT]/com.samsung.shealth.social.public_challenge.detail.20260523103346.csv` | CSV | 346 B | 1 | Yes | Low/no |
| `[EXPORT_ROOT]/com.samsung.shealth.social.public_challenge.history.20260523103346.csv` | CSV | 352 B | 1 | Yes | Low/no |
| `[EXPORT_ROOT]/com.samsung.shealth.social.service_status.20260523103346.csv` | CSV | 645 B | 4 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.step_daily_trend.20260523103346.csv` | CSV | 185.4 KiB | 736 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.stress.20260523103346.csv` | CSV | 2.5 KiB | 11 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.stress.histogram.20260523103346.csv` | CSV | 714 B | 3 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.tracker.floors_day_summary.20260523103346.csv` | CSV | 51.2 KiB | 241 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.tracker.heart_rate.20260523103346.csv` | CSV | 2.63 MiB | 11580 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.tracker.oxygen_saturation.20260523103346.csv` | CSV | 116.9 KiB | 370 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.tracker.pedometer_day_summary.20260523103346.csv` | CSV | 265.9 KiB | 737 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.tracker.pedometer_step_count.20260523103346.csv` | CSV | 1.74 MiB | 8168 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.vitality.nap_data.20260523103346.csv` | CSV | 7.2 KiB | 31 | Yes | Yes |
| `[EXPORT_ROOT]/com.samsung.shealth.vitality_score.20260523103346.csv` | CSV | 141.5 KiB | 229 | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.health.device_profile/**/*.json` | JSON sidecars | 59.3 KiB | 4 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.health.floors_climbed/**/*.json` | JSON sidecars | 115.0 KiB | 1932 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.health.hrv/**/*.json` | JSON sidecars | 6.31 MiB | 1740 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.health.movement/**/*.json` | JSON sidecars | 21.68 MiB | 5309 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.health.oxygen_saturation.raw/**/*.json` | JSON sidecars | 31.36 MiB | 45 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.health.respiratory_rate/**/*.json` | JSON sidecars | 7.43 MiB | 375 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.health.user_profile/**/*.json` | JSON sidecars | 6.4 KiB | 1 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.activity.day_summary/**/*.json` | JSON sidecars | 2.98 MiB | 310 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.calories_burned.details/**/*.json` | JSON sidecars | 65.5 KiB | 283 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.exercise/**/*.json` | JSON sidecars | 44.30 MiB | 1505 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.exercise.periodization_training_program/**/*.json` | JSON sidecars | 2.05 MiB | 3 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.exercise.periodization_training_schedule/**/*.json` | JSON sidecars | 22.2 KiB | 1 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.exercise.recovery_heart_rate/**/*.json` | JSON sidecars | 171.5 KiB | 41 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.preferences/**/*.json` | JSON sidecars | 79.0 KiB | 5 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.program.sleep_coaching.session/**/*.json` | JSON sidecars | 88 B | 2 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.service_preferences/**/*.json` | JSON sidecars | 24 B | 1 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.sleep_raw_data/**/*.json` | JSON sidecars | 2.25 MiB | 9 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.social.public_challenge/**/*.json` | JSON sidecars | 2.5 KiB | 1 files | Yes | Low |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.social.public_challenge.detail/**/*.json` | JSON sidecars | 6.4 KiB | 1 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.social.public_challenge.history/**/*.json` | JSON sidecars | 44 B | 1 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.step_daily_trend/**/*.json` | JSON sidecars | 6.42 MiB | 736 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.stress.histogram/**/*.json` | JSON sidecars | 361 B | 3 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.tracker.floors_day_summary/**/*.json` | JSON sidecars | 68.0 KiB | 241 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.tracker.heart_rate/**/*.json` | JSON sidecars | 11.01 MiB | 2086 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.tracker.oxygen_saturation/**/*.json` | JSON sidecars | 4.48 MiB | 370 files | Yes | Yes |
| `[EXPORT_ROOT]/jsons/com.samsung.shealth.tracker.pedometer_day_summary/**/*.json` | JSON sidecars | 19.70 MiB | 1727 files | Yes | Yes |
| `[EXPORT_ROOT]/files/**/*.jpg` | JPG images | 23.77 MiB | 41 files | Not parsed | Low for dashboard; private images |

Non-useful or privacy-sensitive binary assets: meal images and profile image. No `__MACOSX` or `.DS_Store` files were observed. Empty files were not observed among parsed CSV/JSON groups.

# 3. Detected Health Data Categories

| Category | Status | File(s) | Row Count | Date Range | Confidence | Notes |
|---------|--------|---------|-----------|------------|------------|-------|
| Heart rate | Available | `com.samsung.health.hrv.20260523103346.csv`, `com.samsung.shealth.exercise.recovery_heart_rate.20260523103346.csv`, `com.samsung.shealth.tracker.heart_rate.20260523103346.csv` | 13361 | 2025-09-11 to 2026-05-23 | High | Primary parser target. |
| Steps | Available | `com.samsung.health.floors_climbed.20260523103346.csv`, `com.samsung.health.movement.20260523103346.csv`, `com.samsung.shealth.activity.day_summary.20260523103346.csv`, `com.samsung.shealth.step_daily_trend.20260523103346.csv`, `com.samsung.shealth.tracker.floors_day_summary.20260523103346.csv`; ... | 17433 | 2025-08-15 to 2026-05-23 | High | Primary parser target. |
| Sleep | Available | `com.samsung.health.sleep_stage.20260523103346.csv`, `com.samsung.shealth.sleep.20260523103346.csv`, `com.samsung.shealth.sleep_combined.20260523103346.csv`, `com.samsung.shealth.sleep_raw_data.20260523103346.csv`, `com.samsung.shealth.vitality.nap_data.20260523103346.csv` | 28218 | 2025-09-11 to 2026-05-23 | High | Primary parser target. |
| Exercise/workouts | Available | `com.samsung.shealth.exercise.20260523103346.csv`, `com.samsung.shealth.exercise.extension.20260523103346.csv`, `com.samsung.shealth.exercise.periodization_training_program.20260523103346.csv`, `com.samsung.shealth.exercise.periodization_training_schedule.20260523103346.csv`, `com.samsung.shealth.exercise.weather.20260523103346.csv` | 601 | 2025-09-11 to 2026-05-23 | High | Primary parser target. |
| Stress | Available | `com.samsung.shealth.breathing.20260523103346.csv`, `com.samsung.shealth.mindfulness.history.20260523103346.csv`, `com.samsung.shealth.mood.20260523103346.csv`, `com.samsung.shealth.stress.20260523103346.csv`, `com.samsung.shealth.stress.histogram.20260523103346.csv`; ... | 250 | 2025-09-12 to 2026-05-23 | High | Primary parser target. |
| Blood oxygen / SpO2 | Available | `com.samsung.health.oxygen_saturation.raw.20260523103346.csv`, `com.samsung.shealth.tracker.oxygen_saturation.20260523103346.csv` | 415 | 2025-09-11 to 2026-05-23 | High | Primary parser target. |
| Blood pressure | Missing | None detected | 0 | N/A | High | No matching Samsung Health tables found. |
| ECG if available | Missing | None detected | 0 | N/A | High | No matching Samsung Health tables found. |
| Body weight | Available | `com.samsung.health.weight.20260523103346.csv` | 8 | 2025-09-30 to 2025-11-01 | Medium | Primary parser target. |
| Body composition | Available | `com.samsung.health.height.20260523103346.csv`, `com.samsung.health.weight.20260523103346.csv` | 12 | 2025-09-30 to 2026-02-22 | Medium | Primary parser target. |
| Calories | Available | `com.samsung.shealth.activity.day_summary.20260523103346.csv`, `com.samsung.shealth.calories_burned.details.20260523103346.csv`, `com.samsung.shealth.exercise.20260523103346.csv`, `com.samsung.shealth.exercise.extension.20260523103346.csv`, `com.samsung.shealth.exercise.periodization_training_program.20260523103346.csv`; ... | 2708 | 2025-08-15 to 2026-05-23 | High | Primary parser target. |
| Nutrition/food | Available | `com.samsung.health.food_info.20260523103346.csv`, `com.samsung.health.food_intake.20260523103346.csv`, `com.samsung.health.nutrition.20260523103346.csv`, `com.samsung.shealth.food_favorite.20260523103346.csv`, `com.samsung.shealth.food_frequent.20260523103346.csv`; ... | 215 | 2025-09-11 to 2026-03-16 | High | Primary parser target. |
| Water intake | Available | `com.samsung.health.water_intake.20260523103346.csv` | 2 | 2025-09-11 to 2025-09-23 | Medium | Primary parser target. |
| Menstrual cycle if present | Missing | None detected | 0 | N/A | High | No matching Samsung Health tables found. |
| Device/source metadata | Available | `com.samsung.health.device_profile.20260523103346.csv`, `com.samsung.health.user_profile.20260523103346.csv`, `com.samsung.shealth.hsp.references.20260523103346.csv` | 8205 | 2025-09-09 to 2026-05-23 | High | Primary parser target. |
| Unknown/unsupported health files | Partially available | `com.samsung.shealth.badge.20260523103346.csv`, `com.samsung.shealth.best_records.20260523103346.csv`, `com.samsung.shealth.insight_message.20260523103346.csv`, `com.samsung.shealth.preferences.20260523103346.csv`, `com.samsung.shealth.service_preferences.20260523103346.csv`; ... | 325 | 2025-09-11 to 2026-05-23 | Low | Mostly badges, insight messages, public challenge/social state, or preferences; not core health metrics. |

# 4. File-by-File Schema Discovery

All CSV row counts exclude the Samsung metadata line and header line. JSON UUID file names are masked or summarized as grouped sidecars because they are per-record payloads and include unique identifiers.

## File: `[EXPORT_ROOT]/com.samsung.health.device_profile.20260523103346.csv`
- Detected category: Device/source metadata
- Confidence: Medium
- Row count: 8
- Date range: `update_time` 2025-09-09 to 2026-05-09 (8 parsed); `create_time` 2025-09-09 to 2026-02-27 (8 parsed)
- Headers/fields: `manufacturer, providing_step_goal, create_sh_ver, step_source_group, device_type, backsync_step_goal, capability, modify_sh_ver, device_group, update_time, create_time, name, model, legacy_deviceuuid, connectivity_type, deviceuuid, pkg_name, accessory_type, fixed_name, datauuid`
- Important columns: `step_source_group, backsync_step_goal, device_group`
- Possible timestamp columns: `update_time, create_time`
- Possible value columns: `step_source_group, backsync_step_goal, device_group`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `create_sh_ver` 8/8; `legacy_deviceuuid` 8/8; `connectivity_type` 8/8; `accessory_type` 8/8; `fixed_name` 7/8; `modify_sh_ver` 5/8
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "manufacturer": "realme",
  "providing_step_goal": "",
  "create_sh_ver": "",
  "step_source_group": "",
  "device_type": "",
  "backsync_step_goal": "",
  "capability": "",
  "modify_sh_ver": "",
  "device_group": "[MASKED_ID]",
  "update_time": "2026-04-20 10:56:43.470",
  "create_time": "2026-02-27 18:23:36.495",
  "name": "[MASKED_TEXT]",
  "model": "RMX3868",
  "legacy_deviceuuid": "",
  "connectivity_type": "",
  "deviceuuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.floors_climbed.20260523103346.csv`
- Detected category: Steps/activity
- Confidence: High
- Row count: 1932
- Date range: `start_time` 2025-09-11 to 2026-05-22 (1932 parsed); `update_time` 2025-09-12 to 2026-05-23 (1932 parsed); `create_time` 2025-09-12 to 2026-05-23 (1932 parsed); `end_time` 2025-09-12 to 2026-05-23 (1932 parsed)
- Headers/fields: `start_time, custom, update_time, create_time, client_data_id, client_data_ver, floor, raw_data, time_offset, deviceuuid, pkg_name, end_time, datauuid`
- Important columns: `floor`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset, end_time`
- Possible value columns: `floor`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `custom` 1932/1932; `client_data_id` 1932/1932; `client_data_ver` 1932/1932
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "start_time": "2026-02-26 18:30:14.460",
  "custom": "",
  "update_time": "2026-02-27 04:11:34.125",
  "create_time": "2026-02-27 04:11:15.086",
  "client_data_id": "",
  "client_data_ver": "",
  "floor": "2.0",
  "raw_data": "[MASKED_ID].raw_data.json",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "end_time": "2026-02-27 04:11:14.000",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.food_info.20260523103346.csv`
- Detected category: Nutrition/food
- Confidence: Medium
- Row count: 9
- Date range: `update_time` 2025-11-10 to 2026-03-02 (9 parsed); `create_time` 2025-11-10 to 2026-03-02 (9 parsed)
- Headers/fields: `potassium, vitamin_a, vitamin_c, vitamin_d, cholesterol, description, custom, provider_food_id, metric_serving_amount, sodium, dietary_fiber, total_fat, update_time, create_time, monosaturated_fat, protein, polysaturated_fat, iron, name, sugar, added_sugar, calcium, calorie, serving_description, info_provider, deviceuuid, metric_serving_unit, saturated_fat, trans_fat, pkg_name, carbohydrate, unit_count_per_calorie, datauuid, default_number_of_serving_unit`
- Important columns: `potassium, vitamin_a, vitamin_c, vitamin_d, cholesterol, metric_serving_amount, sodium, dietary_fiber, total_fat, monosaturated_fat, protein, polysaturated_fat`
- Possible timestamp columns: `update_time, create_time`
- Possible value columns: `potassium, vitamin_a, vitamin_c, vitamin_d, cholesterol, metric_serving_amount, sodium, dietary_fiber, total_fat, monosaturated_fat, protein, polysaturated_fat`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `custom` 9/9; `info_provider` 9/9
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "potassium": "30.0",
  "vitamin_a": "0.0",
  "vitamin_c": "0.0",
  "vitamin_d": "0.0",
  "cholesterol": "0.0",
  "description": "[MASKED_TEXT]",
  "custom": "",
  "provider_food_id": "[MASKED_ID]",
  "metric_serving_amount": "1",
  "sodium": "65.0",
  "dietary_fiber": "0.3",
  "total_fat": "0.2",
  "update_time": "2026-03-02 14:35:10.192",
  "create_time": "2025-11-10 07:19:25.243",
  "monosaturated_fat": "0.0",
  "protein": "1.7"
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.food_intake.20260523103346.csv`
- Detected category: Nutrition/food
- Confidence: Medium
- Row count: 73
- Date range: `start_time` 2025-09-11 to 2026-03-16 (73 parsed); `update_time` 2025-09-11 to 2026-03-16 (73 parsed); `create_time` 2025-09-11 to 2026-03-16 (73 parsed)
- Headers/fields: `create_sh_ver, start_time, amount, custom, modify_sh_ver, update_time, create_time, meal_type, client_data_id, name, unit, client_data_ver, calorie, time_offset, deviceuuid, comment, pkg_name, datauuid, food_info_id`
- Important columns: `amount, unit, calorie`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset`
- Possible value columns: `amount, unit, calorie`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `custom` 73/73; `client_data_id` 73/73; `client_data_ver` 73/73; `comment` 73/73; `name` 64/73; `unit` 3/73
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "62910051",
  "start_time": "2025-09-11 17:07:15.737",
  "amount": "1.0",
  "custom": "",
  "modify_sh_ver": "62910051",
  "update_time": "2025-09-11 17:07:15.750",
  "create_time": "2025-09-11 17:07:15.750",
  "meal_type": "100003",
  "client_data_id": "",
  "name": "",
  "unit": "",
  "client_data_ver": "",
  "calorie": "450.0",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "comment": ""
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.height.20260523103346.csv`
- Detected category: Body metrics
- Confidence: Low
- Row count: 4
- Date range: `start_time` 2025-09-30 to 2026-02-22 (4 parsed); `update_time` 2025-09-30 to 2026-02-22 (4 parsed); `create_time` 2025-09-30 to 2026-02-22 (4 parsed)
- Headers/fields: `create_sh_ver, start_time, custom, height, modify_sh_ver, update_time, create_time, time_offset, deviceuuid, pkg_name, datauuid`
- Important columns: `height`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset`
- Possible value columns: `height`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `custom` 4/4
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "62910051",
  "start_time": "2025-09-30 13:51:56.729",
  "custom": "",
  "height": "176.0",
  "modify_sh_ver": "62910051",
  "update_time": "2025-09-30 13:51:56.752",
  "create_time": "2025-09-30 13:51:56.752",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.hrv.20260523103346.csv`
- Detected category: Heart rate
- Confidence: High
- Row count: 1740
- Date range: `start_time` 2025-09-11 to 2026-05-23 (1740 parsed); `update_time` 2025-09-11 to 2026-05-23 (1740 parsed); `create_time` 2025-09-11 to 2026-05-23 (1740 parsed); `end_time` 2025-09-11 to 2026-05-23 (1740 parsed)
- Headers/fields: `create_sh_ver, start_time, custom, binning_data, modify_sh_ver, update_time, create_time, time_offset, deviceuuid, comment, pkg_name, end_time, datauuid`
- Important columns: `create_sh_ver, start_time, custom, binning_data, modify_sh_ver, update_time, create_time, time_offset`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset, end_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `custom` 1740/1740; `comment` 1740/1740
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "62910051",
  "start_time": "2026-02-26 16:30:00.000",
  "custom": "",
  "binning_data": "[MASKED_ID].binning_data.json",
  "modify_sh_ver": "62910051",
  "update_time": "2026-02-26 16:37:39.509",
  "create_time": "2026-02-26 16:37:39.509",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "comment": "",
  "pkg_name": "[MASKED_ID]",
  "end_time": "2026-02-26 16:37:39.457",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.movement.20260523103346.csv`
- Detected category: Steps/activity
- Confidence: High
- Row count: 5309
- Date range: `start_time` 2025-09-11 to 2026-05-23 (5309 parsed); `update_time` 2025-09-11 to 2026-05-23 (5309 parsed); `create_time` 2025-09-11 to 2026-05-23 (5309 parsed); `end_time` 2025-09-11 to 2026-05-23 (5309 parsed)
- Headers/fields: `create_sh_ver, start_time, custom, binning_data, modify_sh_ver, update_time, create_time, time_offset, deviceuuid, comment, pkg_name, end_time, datauuid`
- Important columns: `create_sh_ver, start_time, custom, binning_data, modify_sh_ver, update_time, create_time, time_offset`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset, end_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `custom` 5309/5309; `comment` 5309/5309
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "62910051",
  "start_time": "2026-02-26 15:57:00.000",
  "custom": "",
  "binning_data": "[MASKED_ID].binning_data.json",
  "modify_sh_ver": "62910051",
  "update_time": "2026-02-26 16:17:01.245",
  "create_time": "2026-02-26 16:17:01.245",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "comment": "",
  "pkg_name": "[MASKED_ID]",
  "end_time": "2026-02-26 15:59:59.999",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.nutrition.20260523103346.csv`
- Detected category: Nutrition/food
- Confidence: Medium
- Row count: 67
- Date range: `start_time` 2025-09-11 to 2026-03-16 (67 parsed); `update_time` 2025-09-11 to 2026-03-16 (67 parsed); `create_time` 2025-09-11 to 2026-03-16 (67 parsed)
- Headers/fields: `magnesium, potassium, create_sh_ver, vitamin_a, vitamin_c, vitamin_d, vitamin_e, vitamin_k, cholesterol, vitamin_b12, start_time, biotin, phosphorus, copper, custom, thiamin, folate, iodine, niacin, sodium, molybdenum, folic_acid, modify_sh_ver, dietary_fiber, total_fat, update_time, create_time, meal_type, caffeine, monosaturated_fat, protein, manganese, polysaturated_fat, iron, zinc, riboflavin, sugar, title, added_sugar, calories_from_fat, calcium, calorie, time_offset, deviceuuid, polyunsaturated_fat, saturated_fat, trans_fat, pkg_name, selenium, vitamin_b6, carbohydrate, unsaturated_fat, chloride, pantothenic_acid, datauuid, chromium`
- Important columns: `potassium, vitamin_a, vitamin_c, vitamin_d, cholesterol, sodium, dietary_fiber, total_fat, monosaturated_fat, protein, polysaturated_fat, iron`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset`
- Possible value columns: `potassium, vitamin_a, vitamin_c, vitamin_d, cholesterol, sodium, dietary_fiber, total_fat, monosaturated_fat, protein, polysaturated_fat, iron`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `magnesium` 67/67; `vitamin_e` 67/67; `vitamin_k` 67/67; `vitamin_b12` 67/67; `biotin` 67/67; `phosphorus` 67/67
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "magnesium": "",
  "potassium": "0.0",
  "create_sh_ver": "63030110",
  "vitamin_a": "0.0",
  "vitamin_c": "0.0",
  "vitamin_d": "0.0",
  "vitamin_e": "",
  "vitamin_k": "",
  "cholesterol": "0.0",
  "vitamin_b12": "",
  "start_time": "2025-09-11 17:07:17.145",
  "biotin": "",
  "phosphorus": "",
  "copper": "",
  "custom": "",
  "thiamin": ""
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.oxygen_saturation.raw.20260523103346.csv`
- Detected category: Blood oxygen / SpO2
- Confidence: High
- Row count: 45
- Date range: `start_time` 2026-04-18 to 2026-05-22 (45 parsed); `update_time` 2026-04-19 to 2026-05-23 (45 parsed); `create_time` 2026-04-19 to 2026-05-23 (45 parsed); `end_time` 2026-04-19 to 2026-05-23 (45 parsed)
- Headers/fields: `start_time, binning_data, update_time, create_time, is_integrated, time_offset, deviceuuid, comment, pkg_name, end_time, datauuid`
- Important columns: `start_time, binning_data, update_time, create_time, is_integrated, time_offset, deviceuuid, comment`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset, end_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `is_integrated` 45/45; `comment` 45/45
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "start_time": "2026-04-18 21:49:00.000",
  "binning_data": "[MASKED_ID].binning_data.json",
  "update_time": "2026-04-19 04:40:59.990",
  "create_time": "2026-04-19 04:40:59.990",
  "is_integrated": "",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "comment": "",
  "pkg_name": "[MASKED_ID]",
  "end_time": "2026-04-19 04:11:00.000",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.respiratory_rate.20260523103346.csv`
- Detected category: Unknown/unsupported
- Confidence: Low
- Row count: 375
- Date range: `start_time` 2025-09-11 to 2026-05-22 (375 parsed); `update_time` 2025-09-12 to 2026-05-23 (375 parsed); `create_time` 2025-09-12 to 2026-05-23 (375 parsed); `end_time` 2025-09-12 to 2026-05-23 (375 parsed)
- Headers/fields: `create_sh_ver, start_time, custom, binning_data, modify_sh_ver, average, lower_limit, update_time, create_time, client_data_id, upper_limit, client_data_ver, is_outlier, pplib_version, time_offset, deviceuuid, comment, pkg_name, end_time, datauuid`
- Important columns: `lower_limit, upper_limit, is_outlier`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset, end_time`
- Possible value columns: `lower_limit, upper_limit, is_outlier`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `custom` 375/375; `client_data_id` 375/375; `client_data_ver` 375/375; `comment` 375/375
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Not a primary dashboard table; parse only for metadata, references, or future support.
- Anonymized sample row:
```json
{
  "create_sh_ver": "62910051",
  "start_time": "2026-02-26 18:10:00.000",
  "custom": "",
  "binning_data": "[MASKED_ID].binning_data.json",
  "modify_sh_ver": "62910051",
  "average": "16.156563",
  "lower_limit": "0.0",
  "update_time": "2026-02-26 21:11:15.061",
  "create_time": "2026-02-26 21:11:15.061",
  "client_data_id": "",
  "upper_limit": "0.0",
  "client_data_ver": "",
  "is_outlier": "0",
  "pplib_version": "1.01.04",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.sleep_stage.20260523103346.csv`
- Detected category: Sleep
- Confidence: High
- Row count: 27703
- Date range: `start_time` 2025-09-11 to 2026-05-23 (27703 parsed); `update_time` 2025-09-12 to 2026-05-23 (27703 parsed); `create_time` 2025-09-12 to 2026-05-23 (27703 parsed); `end_time` 2025-09-11 to 2026-05-23 (27703 parsed)
- Headers/fields: `create_sh_ver, start_time, sleep_id, custom, modify_sh_ver, update_time, create_time, stage, time_offset, deviceuuid, pkg_name, end_time, datauuid`
- Important columns: `create_sh_ver, start_time, sleep_id, custom, modify_sh_ver, update_time, create_time, stage`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset, end_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `custom` 27703/27703
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Medium
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "63070030",
  "start_time": "2026-02-26 22:33:00.000",
  "sleep_id": "[MASKED_ID]",
  "custom": "",
  "modify_sh_ver": "63070030",
  "update_time": "2026-02-27 18:23:54.235",
  "create_time": "2026-02-27 18:23:54.235",
  "stage": "[MASKED_ID]",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "end_time": "2026-02-26 22:48:00.000",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.user_profile.20260523103346.csv`
- Detected category: Device/source metadata
- Confidence: Medium
- Row count: 21
- Date range: `update_time` 2025-10-01 to 2026-05-23 (14 parsed); `create_time` 2025-09-11 to 2026-02-27 (13 parsed)
- Headers/fields: `text_value, create_sh_ver, float_value, modify_sh_ver, update_time, create_time, long_value, key, blob_value, int_value, deviceuuid, pkg_name, double_value, datauuid`
- Important columns: `text_value, float_value, int_value`
- Possible timestamp columns: `update_time, create_time`
- Possible value columns: `text_value, float_value, int_value`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `long_value` 21/21; `double_value` 21/21; `int_value` 20/21; `float_value` 19/21; `blob_value` 19/21; `create_sh_ver` 8/21
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "text_value": "kg",
  "create_sh_ver": "",
  "float_value": "",
  "modify_sh_ver": "",
  "update_time": "1970-01-01 00:00:00.001",
  "create_time": "1970-01-01 00:00:00.001",
  "long_value": "",
  "key": "weight_unit",
  "blob_value": "",
  "int_value": "",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "double_value": "",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.water_intake.20260523103346.csv`
- Detected category: Water intake
- Confidence: Medium
- Row count: 2
- Date range: `start_time` 2025-09-11 to 2025-09-23 (2 parsed); `update_time` 2025-09-11 to 2025-09-23 (2 parsed); `create_time` 2025-09-11 to 2025-09-23 (2 parsed)
- Headers/fields: `start_time, amount, custom, update_time, create_time, client_data_id, client_data_ver, time_offset, deviceuuid, unit_amount, comment, pkg_name, datauuid`
- Important columns: `amount, unit_amount`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset`
- Possible value columns: `amount, unit_amount`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `custom` 2/2; `client_data_id` 2/2; `client_data_ver` 2/2; `comment` 2/2
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "start_time": "2025-09-11 16:55:03.499",
  "amount": "250.0",
  "custom": "",
  "update_time": "2025-09-11 16:55:03.511",
  "create_time": "2025-09-11 16:55:03.511",
  "client_data_id": "",
  "client_data_ver": "",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "unit_amount": "250.0",
  "comment": "",
  "pkg_name": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.health.weight.20260523103346.csv`
- Detected category: Body metrics
- Confidence: Low
- Row count: 8
- Date range: `start_time` 2025-09-30 to 2025-11-01 (8 parsed); `update_time` 2025-09-30 to 2025-11-01 (8 parsed); `create_time` 2025-09-30 to 2025-11-01 (8 parsed)
- Headers/fields: `body_fat_mass, create_sh_ver, start_time, custom, height, weight, muscle_mass, modify_sh_ver, update_time, create_time, client_data_id, skeletal_muscle, fat_free_mass, client_data_ver, basal_metabolic_rate, time_offset, deviceuuid, skeletal_muscle_mass, comment, fat_free, pkg_name, body_fat, datauuid, vfa_level, total_body_water`
- Important columns: `body_fat_mass, height, weight, skeletal_muscle, fat_free_mass, basal_metabolic_rate, skeletal_muscle_mass, fat_free, body_fat, total_body_water`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset`
- Possible value columns: `body_fat_mass, height, weight, skeletal_muscle, fat_free_mass, basal_metabolic_rate, skeletal_muscle_mass, fat_free, body_fat, total_body_water`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `custom` 8/8; `muscle_mass` 8/8; `client_data_id` 8/8; `client_data_ver` 8/8; `comment` 8/8; `vfa_level` 8/8
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "body_fat_mass": "10.392162",
  "create_sh_ver": "62910051",
  "start_time": "2025-09-30 13:53:39.804",
  "custom": "",
  "height": "176.0",
  "weight": "65.0",
  "muscle_mass": "",
  "modify_sh_ver": "62910051",
  "update_time": "2025-09-30 13:53:39.953",
  "create_time": "2025-09-30 13:53:39.953",
  "client_data_id": "",
  "skeletal_muscle": "45.802174",
  "fat_free_mass": "54.607838",
  "client_data_ver": "",
  "basal_metabolic_rate": "1549",
  "time_offset": "UTC+0530"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.activity.day_summary.20260523103346.csv`
- Detected category: Steps/activity
- Confidence: High
- Row count: 310
- Date range: `update_time` 2025-09-11 to 2026-05-23 (310 parsed); `create_time` 2025-09-11 to 2026-05-22 (310 parsed); `day_time` 2025-08-15 to 2026-05-23 (310 parsed)
- Headers/fields: `movement_type, create_sh_ver, energy_type, exercise_time, step_count, exercise_calorie_target, active_time, target, others_time, modify_sh_ver, update_time, floors_target, create_time, floor_count, dynamic_active_time_target, exercise_time_target, goal, longest_active_time, score, move_hourly_count, duration_type, move_hourly_target, distance, dynamic_active_time, calorie, extra_data, deviceuuid, run_time, pkg_name, walk_time, longest_idle_time, datauuid, day_time`
- Important columns: `step_count, exercise_calorie_target, target, floors_target, floor_count, goal, score, move_hourly_count, move_hourly_target, distance, calorie`
- Possible timestamp columns: `exercise_time, active_time, others_time, update_time, create_time, dynamic_active_time_target, exercise_time_target, longest_active_time, dynamic_active_time, run_time, walk_time, longest_idle_time, day_time`
- Possible value columns: `step_count, exercise_calorie_target, target, floors_target, floor_count, goal, score, move_hourly_count, move_hourly_target, distance, calorie`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "movement_type": "0",
  "create_sh_ver": "63070030",
  "energy_type": "0",
  "exercise_time": "1675000",
  "step_count": "11181",
  "exercise_calorie_target": "300",
  "active_time": "7048609",
  "target": "90",
  "others_time": "0",
  "modify_sh_ver": "63110130",
  "update_time": "2026-03-25 03:18:32.744",
  "floors_target": "10",
  "create_time": "2026-02-27 18:23:48.717",
  "floor_count": "0.0",
  "dynamic_active_time_target": "30",
  "exercise_time_target": "30"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.activity_level.20260523103346.csv`
- Detected category: Steps/activity
- Confidence: Low
- Row count: 2
- Date range: `start_time` 2025-11-02 to 2025-11-02 (2 parsed); `update_time` 2025-11-02 to 2025-11-02 (2 parsed); `create_time` 2025-11-02 to 2025-11-14 (2 parsed)
- Headers/fields: `activity_level, start_time, update_time, create_time, time_offset, deviceuuid, pkg_name, datauuid`
- Important columns: `activity_level`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset`
- Possible value columns: `activity_level`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "activity_level": "180003",
  "start_time": "2025-11-02 17:10:39.528",
  "update_time": "2025-11-02 17:10:39.528",
  "create_time": "2025-11-02 17:10:39.561",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.badge.20260523103346.csv`
- Detected category: Unknown/unsupported
- Confidence: Low
- Row count: 145
- Date range: `start_time` 2025-09-11 to 2026-05-20 (142 parsed); `update_time` 2025-09-12 to 2026-05-23 (145 parsed); `create_time` 2025-09-12 to 2026-05-21 (145 parsed); `end_time` 2025-09-12 to 2026-05-23 (145 parsed)
- Headers/fields: `number_of_streak, start_time, exercise_type, device_type, status, sleep_coaching_session_uuid, update_time, create_time, source_pkg_name, key, program_id, is_shown, time_offset, extra_data, deviceuuid, pkg_name, exercise_data_uuid, controller_id, end_time, datauuid`
- Important columns: `number_of_streak, extra_data`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset, end_time`
- Possible value columns: `number_of_streak, extra_data`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `program_id` 145/145; `is_shown` 145/145; `exercise_type` 143/145; `device_type` 143/145; `sleep_coaching_session_uuid` 143/145; `source_pkg_name` 143/145
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Not a primary dashboard table; parse only for metadata, references, or future support.
- Anonymized sample row:
```json
{
  "number_of_streak": "1",
  "start_time": "2026-02-26 18:30:00.000",
  "exercise_type": "",
  "device_type": "",
  "status": "1",
  "sleep_coaching_session_uuid": "",
  "update_time": "2026-02-27 18:23:56.706",
  "create_time": "2026-02-27 18:23:56.706",
  "source_pkg_name": "",
  "key": "sleep_goal_first_sleep",
  "program_id": "",
  "is_shown": "",
  "time_offset": "UTC+0530",
  "extra_data": "",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.best_records.20260523103346.csv`
- Detected category: Unknown/unsupported
- Confidence: Low
- Row count: 9
- Date range: `update_time` 2026-05-22 to 2026-05-22 (9 parsed); `create_time` 2025-09-13 to 2026-05-20 (9 parsed); `date` 2025-09-12 to 2026-05-19 (9 parsed)
- Headers/fields: `source_id, device_type, update_time, create_time, source_pkg_name, date, type, value, is_shown, extra_data, extra_type, deviceuuid, pkg_name, controller_id, datauuid`
- Important columns: `value, is_shown`
- Possible timestamp columns: `update_time, create_time, date`
- Possible value columns: `value, is_shown`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `source_id` 9/9; `source_pkg_name` 9/9; `extra_data` 9/9
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Not a primary dashboard table; parse only for metadata, references, or future support.
- Anonymized sample row:
```json
{
  "source_id": "",
  "device_type": "[MASKED_ID]",
  "update_time": "2026-05-22 18:30:07.683",
  "create_time": "2025-09-13 08:19:01.802",
  "source_pkg_name": "",
  "date": "1757635200000",
  "type": "0",
  "value": "7565.0",
  "is_shown": "0",
  "extra_data": "",
  "extra_type": "-1",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "controller_id": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.breathing.20260523103346.csv`
- Detected category: Stress/recovery
- Confidence: Medium
- Row count: 2
- Date range: `start_time` 2025-10-26 to 2026-03-05 (2 parsed); `update_time` 2025-10-26 to 2026-03-05 (2 parsed); `create_time` 2025-10-26 to 2026-03-05 (2 parsed); `end_time` 2025-10-26 to 2026-03-05 (2 parsed)
- Headers/fields: `duration, create_sh_ver, start_time, exhale_hold_duration, custom, modify_sh_ver, update_time, create_time, exhale_duration, type, cycle, time_offset, deviceuuid, inhale_hold_duration, pkg_name, end_time, datauuid, inhale_duration`
- Important columns: `duration, exhale_hold_duration, exhale_duration, cycle, inhale_hold_duration, inhale_duration`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset, end_time`
- Possible value columns: `duration, exhale_hold_duration, exhale_duration, cycle, inhale_hold_duration, inhale_duration`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `custom` 2/2; `create_sh_ver` 1/2; `modify_sh_ver` 1/2; `type` 1/2
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "duration": "199627",
  "create_sh_ver": "",
  "start_time": "2025-10-26 03:01:45.524",
  "exhale_hold_duration": "0",
  "custom": "",
  "modify_sh_ver": "",
  "update_time": "2025-10-26 03:05:05.175",
  "create_time": "2025-10-26 03:05:05.175",
  "exhale_duration": "5",
  "type": "",
  "cycle": "19",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "inhale_hold_duration": "0",
  "pkg_name": "[MASKED_ID]",
  "end_time": "2025-10-26 03:05:05.166"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.calories_burned.details.20260523103346.csv`
- Detected category: Unknown/unsupported
- Confidence: Low
- Row count: 283
- Date range: `com.samsung.shealth.calories_burned.update_time` 2025-09-11 to 2026-05-23 (283 parsed); `com.samsung.shealth.calories_burned.create_time` 2025-09-11 to 2026-05-22 (283 parsed); `com.samsung.shealth.calories_burned.day_time` 2025-08-15 to 2026-05-23 (283 parsed)
- Headers/fields: `active_calories_goal, version, extra_data, exercise_calories, total_exercise_calories, com.samsung.shealth.calories_burned.create_sh_ver, com.samsung.shealth.calories_burned.tef_calorie, com.samsung.shealth.calories_burned.active_time, com.samsung.shealth.calories_burned.rest_calorie, com.samsung.shealth.calories_burned.modify_sh_ver, com.samsung.shealth.calories_burned.update_time, com.samsung.shealth.calories_burned.create_time, com.samsung.shealth.calories_burned.active_calorie, com.samsung.shealth.calories_burned.deviceuuid, com.samsung.shealth.calories_burned.pkg_name, com.samsung.shealth.calories_burned.datauuid, com.samsung.shealth.calories_burned.day_time`
- Important columns: `total_exercise_calories, com.samsung.shealth.calories_burned.tef_calorie, com.samsung.shealth.calories_burned.rest_calorie, com.samsung.shealth.calories_burned.active_calorie`
- Possible timestamp columns: `com.samsung.shealth.calories_burned.active_time, com.samsung.shealth.calories_burned.update_time, com.samsung.shealth.calories_burned.create_time, com.samsung.shealth.calories_burned.day_time`
- Possible value columns: `total_exercise_calories, com.samsung.shealth.calories_burned.tef_calorie, com.samsung.shealth.calories_burned.rest_calorie, com.samsung.shealth.calories_burned.active_calorie`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `active_calories_goal` 283/283; `version` 283/283; `exercise_calories` 283/283
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Not a primary dashboard table; parse only for metadata, references, or future support.
- Anonymized sample row:
```json
{
  "active_calories_goal": "",
  "version": "",
  "extra_data": "[MASKED_ID].extra_data.json",
  "exercise_calories": "",
  "total_exercise_calories": "141.0",
  "com.samsung.shealth.calories_burned.create_sh_ver": "63070030",
  "com.samsung.shealth.calories_burned.tef_calorie": "0.0",
  "com.samsung.shealth.calories_burned.active_time": "7048609",
  "com.samsung.shealth.calories_burned.rest_calorie": "1474.7599",
  "com.samsung.shealth.calories_burned.modify_sh_ver": "63070030",
  "com.samsung.shealth.calories_burned.update_time": "2026-03-04 14:35:14.568",
  "com.samsung.shealth.calories_burned.create_time": "2026-02-27 18:23:48.837",
  "com.samsung.shealth.calories_burned.active_calorie": "462.92624",
  "com.samsung.shealth.calories_burned.deviceuuid": "[MASKED_ID]",
  "com.samsung.shealth.calories_burned.pkg_name": "[MASKED_ID]",
  "com.samsung.shealth.calories_burned.datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.exercise.20260523103346.csv`
- Detected category: Exercise/workouts
- Confidence: High
- Row count: 586
- Date range: `com.samsung.health.exercise.start_time` 2025-09-12 to 2026-05-22 (586 parsed); `com.samsung.health.exercise.update_time` 2025-09-12 to 2026-05-23 (586 parsed); `com.samsung.health.exercise.create_time` 2025-09-12 to 2026-05-23 (586 parsed); `com.samsung.health.exercise.end_time` 2025-09-12 to 2026-05-22 (586 parsed)
- Headers/fields: `live_data_internal, mission_value, race_target, subset_data, start_longitude, routine_datauuid, total_calorie, completion_status, pace_info_id, activity_type, pace_live_data, sensing_status, source_type, mission_type, ftp, tracking_status, program_id, title, reward_status, heart_rate_sample_count, start_latitude, mission_extra_value, program_schedule_id, heart_rate_deviceuuid, location_data_internal, custom_id, additional_internal, com.samsung.health.exercise.duration, com.samsung.health.exercise.additional, com.samsung.health.exercise.create_sh_ver, com.samsung.health.exercise.mean_caloricburn_rate, com.samsung.health.exercise.location_data, com.samsung.health.exercise.start_time, com.samsung.health.exercise.exercise_type, com.samsung.health.exercise.custom, com.samsung.health.exercise.max_altitude, com.samsung.health.exercise.incline_distance, com.samsung.health.exercise.mean_heart_rate, com.samsung.health.exercise.count_type, com.samsung.health.exercise.mean_rpm, com.samsung.health.exercise.min_altitude, com.samsung.health.exercise.modify_sh_ver, com.samsung.health.exercise.max_heart_rate, com.samsung.health.exercise.update_time, com.samsung.health.exercise.create_time, com.samsung.health.exercise.client_data_id, com.samsung.health.exercise.max_power, com.samsung.health.exercise.max_speed, com.samsung.health.exercise.mean_cadence, com.samsung.health.exercise.min_heart_rate, com.samsung.health.exercise.client_data_ver, com.samsung.health.exercise.count, com.samsung.health.exercise.distance, com.samsung.health.exercise.max_caloricburn_rate, com.samsung.health.exercise.calorie, com.samsung.health.exercise.max_cadence, com.samsung.health.exercise.decline_distance, com.samsung.health.exercise.vo2_max, com.samsung.health.exercise.time_offset, com.samsung.health.exercise.deviceuuid, com.samsung.health.exercise.max_rpm, com.samsung.health.exercise.comment, com.samsung.health.exercise.live_data, com.samsung.health.exercise.mean_power, com.samsung.health.exercise.mean_speed, com.samsung.health.exercise.pkg_name, com.samsung.health.exercise.altitude_gain, com.samsung.health.exercise.altitude_loss, com.samsung.health.exercise.exercise_custom_type, com.samsung.health.exercise.auxiliary_devices, com.samsung.health.exercise.end_time, com.samsung.health.exercise.datauuid, com.samsung.health.exercise.sweat_loss`
- Important columns: `race_target, total_calorie, com.samsung.health.exercise.duration, com.samsung.health.exercise.max_altitude, com.samsung.health.exercise.mean_heart_rate, com.samsung.health.exercise.min_altitude, com.samsung.health.exercise.max_heart_rate, com.samsung.health.exercise.max_speed, com.samsung.health.exercise.mean_cadence, com.samsung.health.exercise.min_heart_rate, com.samsung.health.exercise.count, com.samsung.health.exercise.distance`
- Possible timestamp columns: `com.samsung.health.exercise.start_time, com.samsung.health.exercise.update_time, com.samsung.health.exercise.create_time, com.samsung.health.exercise.time_offset, com.samsung.health.exercise.end_time`
- Possible value columns: `race_target, total_calorie, com.samsung.health.exercise.duration, com.samsung.health.exercise.max_altitude, com.samsung.health.exercise.mean_heart_rate, com.samsung.health.exercise.min_altitude, com.samsung.health.exercise.max_heart_rate, com.samsung.health.exercise.max_speed, com.samsung.health.exercise.mean_cadence, com.samsung.health.exercise.min_heart_rate, com.samsung.health.exercise.count, com.samsung.health.exercise.distance`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `mission_value` 586/586; `subset_data` 586/586; `start_longitude` 586/586; `routine_datauuid` 586/586; `pace_info_id` 586/586; `activity_type` 586/586
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "live_data_internal": "[MASKED_ID].live_data_internal.json",
  "mission_value": "",
  "race_target": "0",
  "subset_data": "",
  "start_longitude": "",
  "routine_datauuid": "",
  "total_calorie": "58.00002",
  "completion_status": "",
  "pace_info_id": "",
  "activity_type": "",
  "pace_live_data": "",
  "sensing_status": "[MASKED_ID].sensing_status.json",
  "source_type": "[MASKED_ID]",
  "mission_type": "",
  "ftp": "",
  "tracking_status": ""
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.exercise.extension.20260523103346.csv`
- Detected category: Exercise/workouts
- Confidence: Low
- Row count: 10
- Date range: `update_time` 2026-03-07 to 2026-05-23 (10 parsed); `create_time` 2026-03-07 to 2026-05-23 (10 parsed)
- Headers/fields: `live_data_internal, location_data, update_time, create_time, deviceuuid, exercise_id, live_data, pkg_name, location_data_internal, datauuid`
- Important columns: `live_data_internal, location_data, update_time, create_time, deviceuuid, exercise_id, live_data, pkg_name`
- Possible timestamp columns: `update_time, create_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `live_data_internal` 10/10; `location_data` 10/10; `live_data` 10/10; `location_data_internal` 10/10
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "live_data_internal": "",
  "location_data": "",
  "update_time": "2026-03-07 05:35:54.651",
  "create_time": "2026-03-07 05:35:54.651",
  "deviceuuid": "[MASKED_ID]",
  "exercise_id": "[MASKED_ID]",
  "live_data": "",
  "pkg_name": "[MASKED_ID]",
  "location_data_internal": "",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.exercise.periodization_training_program.20260523103346.csv`
- Detected category: Exercise/workouts
- Confidence: Low
- Row count: 3
- Date range: `start_time` 2025-09-11 to 2026-02-27 (3 parsed); `update_time` 2025-10-24 to 2026-02-27 (3 parsed); `create_time` 2025-09-11 to 2026-02-27 (3 parsed)
- Headers/fields: `create_sh_ver, start_time, modify_sh_ver, update_time, create_time, program, time_offset, deviceuuid, pkg_name, datauuid`
- Important columns: `create_sh_ver, start_time, modify_sh_ver, update_time, create_time, program, time_offset, deviceuuid`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "63070030",
  "start_time": "2026-02-27 18:23:44.579",
  "modify_sh_ver": "63070030",
  "update_time": "2026-02-27 18:23:45.126",
  "create_time": "2026-02-27 18:23:45.126",
  "program": "[MASKED_ID].program.json",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.exercise.periodization_training_schedule.20260523103346.csv`
- Detected category: Exercise/workouts
- Confidence: Low
- Row count: 1
- Date range: `start_time` 2025-09-11 to 2025-09-11 (1 parsed); `update_time` 2025-10-30 to 2025-10-30 (1 parsed); `create_time` 2025-09-11 to 2025-09-11 (1 parsed)
- Headers/fields: `create_sh_ver, start_time, coach_id, status, schedule, modify_sh_ver, update_time, create_time, type, time_offset, deviceuuid, pkg_name, program_uuid, datauuid`
- Important columns: `create_sh_ver, start_time, coach_id, status, schedule, modify_sh_ver, update_time, create_time`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "63030110",
  "start_time": "2025-09-11 15:19:31.773",
  "coach_id": "[MASKED_ID]",
  "status": "1",
  "schedule": "[MASKED_ID].schedule.json",
  "modify_sh_ver": "63051050",
  "update_time": "2025-10-30 02:34:37.127",
  "create_time": "2025-09-11 15:19:32.081",
  "type": "1",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "program_uuid": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.exercise.recovery_heart_rate.20260523103346.csv`
- Detected category: Heart rate
- Confidence: High
- Row count: 41
- Date range: `start_time` 2025-10-04 to 2026-05-22 (41 parsed); `update_time` 2025-10-04 to 2026-05-22 (41 parsed); `create_time` 2025-10-04 to 2026-05-22 (41 parsed); `end_time` 2025-10-04 to 2026-05-22 (41 parsed)
- Headers/fields: `create_sh_ver, start_time, modify_sh_ver, update_time, create_time, time_offset, deviceuuid, exercise_id, pkg_name, end_time, datauuid, heart_rate`
- Important columns: `create_sh_ver, start_time, modify_sh_ver, update_time, create_time, time_offset, deviceuuid, exercise_id`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset, end_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "62910051",
  "start_time": "2025-10-04 05:41:13.465",
  "modify_sh_ver": "62910051",
  "update_time": "2025-10-04 05:43:13.591",
  "create_time": "2025-10-04 05:43:13.591",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "exercise_id": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "end_time": "2025-10-04 05:43:13.465",
  "datauuid": "[MASKED_ID]",
  "heart_rate": "[MASKED_ID].heart_rate.json"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.exercise.weather.20260523103346.csv`
- Detected category: Exercise/workouts
- Confidence: Low
- Row count: 1
- Date range: `start_time` 2025-10-04 to 2025-10-04 (1 parsed); `update_time` 2025-10-04 to 2025-10-04 (1 parsed); `create_time` 2025-10-04 to 2025-10-04 (1 parsed)
- Headers/fields: `uv_index, sunset_time, start_time, latitude, custom, wind_direction, phrase, sundown_time, temperature_scale, content_provider, update_time, create_time, type, longitude, temperature, humidity, time_offset, deviceuuid, exercise_id, pkg_name, wind_speed_unit, forecast_time, wind_speed, icon_info_id, datauuid`
- Important columns: `latitude, temperature_scale, longitude, temperature`
- Possible timestamp columns: `sunset_time, start_time, sundown_time, update_time, create_time, time_offset, forecast_time`
- Possible value columns: `latitude, temperature_scale, longitude, temperature`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `uv_index` 1/1; `sunset_time` 1/1; `custom` 1/1; `wind_direction` 1/1; `sundown_time` 1/1; `content_provider` 1/1
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "uv_index": "",
  "sunset_time": "",
  "start_time": "2025-10-04 03:14:04.779",
  "latitude": "[MASKED_LOCATION]",
  "custom": "",
  "wind_direction": "",
  "phrase": "[MASKED_TEXT]",
  "sundown_time": "",
  "temperature_scale": "1",
  "content_provider": "",
  "update_time": "2025-10-04 03:16:39.957",
  "create_time": "2025-10-04 03:16:39.957",
  "type": "1",
  "longitude": "[MASKED_LOCATION]",
  "temperature": "22.0",
  "humidity": ""
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.food_favorite.20260523103346.csv`
- Detected category: Nutrition/food
- Confidence: Medium
- Row count: 18
- Date range: `update_time` 2025-11-10 to 2026-03-02 (18 parsed); `create_time` 2025-11-10 to 2026-03-02 (18 parsed)
- Headers/fields: `amount, food_type, update_time, create_time, name, unit, favoriteid, calorie, deviceuuid, pkg_name, datauuid, food_info_id`
- Important columns: `amount, unit, calorie`
- Possible timestamp columns: `update_time, create_time`
- Possible value columns: `amount, unit, calorie`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `unit` 9/18
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "amount": "1.0",
  "food_type": "3",
  "update_time": "2025-11-10 07:19:25.261",
  "create_time": "2025-11-10 07:19:25.261",
  "name": "[MASKED_TEXT]",
  "unit": "120001",
  "favoriteid": "[MASKED_ID]",
  "calorie": "40.0",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]",
  "food_info_id": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.food_frequent.20260523103346.csv`
- Detected category: Nutrition/food
- Confidence: Medium
- Row count: 8
- Date range: `update_time` 2025-11-11 to 2026-03-02 (8 parsed); `create_time` 2025-11-10 to 2026-03-02 (8 parsed)
- Headers/fields: `eveningsnack_count, update_time, create_time, morningsnack_count, dinner_count, breakfast_count, deviceuuid, pkg_name, afternoonsnack_count, datauuid, food_info_id, lunch_count`
- Important columns: `eveningsnack_count, morningsnack_count, dinner_count, breakfast_count, afternoonsnack_count, lunch_count`
- Possible timestamp columns: `update_time, create_time`
- Possible value columns: `eveningsnack_count, morningsnack_count, dinner_count, breakfast_count, afternoonsnack_count, lunch_count`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "eveningsnack_count": "0.0",
  "update_time": "2026-03-02 14:35:10.455",
  "create_time": "2025-11-10 07:19:40.621",
  "morningsnack_count": "0.0",
  "dinner_count": "0.0",
  "breakfast_count": "2.0",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "afternoonsnack_count": "0.0",
  "datauuid": "[MASKED_ID]",
  "food_info_id": "[MASKED_ID]",
  "lunch_count": "0.0"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.food_image.20260523103346.csv`
- Detected category: Nutrition/food
- Confidence: Medium
- Row count: 40
- Date range: `start_time` 2026-03-06 to 2026-03-16 (40 parsed); `update_time` 2026-03-06 to 2026-03-16 (40 parsed); `create_time` 2026-03-06 to 2026-03-16 (40 parsed)
- Headers/fields: `start_time, meal_image, update_time, create_time, meal_type, time_offset, deviceuuid, pkg_name, datauuid`
- Important columns: `start_time, meal_image, update_time, create_time, meal_type, time_offset, deviceuuid, pkg_name`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "start_time": "2026-03-06 14:08:26.798",
  "meal_image": "[MASKED_ID].meal_image.jpg",
  "update_time": "2026-03-06 14:09:12.875",
  "create_time": "2026-03-06 14:09:12.875",
  "meal_type": "100003",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.hsp.references.20260523103346.csv`
- Detected category: Device/source metadata
- Confidence: Medium
- Row count: 8176
- Date range: `update_time` 2025-10-01 to 2026-05-23 (8176 parsed); `create_time` 2025-10-01 to 2026-05-23 (8176 parsed)
- Headers/fields: `hsp_id, shealth_id, update_time, create_time, shealth_data_type, deviceuuid, pkg_name, datauuid`
- Important columns: `hsp_id, shealth_id, update_time, create_time, shealth_data_type, deviceuuid, pkg_name, datauuid`
- Possible timestamp columns: `update_time, create_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Not a primary dashboard table; parse only for metadata, references, or future support.
- Anonymized sample row:
```json
{
  "hsp_id": "[MASKED_ID]",
  "shealth_id": "[MASKED_ID]",
  "update_time": "2025-10-01 16:51:07.385",
  "create_time": "2025-10-01 16:51:07.385",
  "shealth_data_type": "10004",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.insight_message.20260523103346.csv`
- Detected category: Unknown/unsupported
- Confidence: Low
- Row count: 70
- Date range: `update_time` 2026-02-28 to 2026-05-23 (70 parsed); `create_time` 2026-02-28 to 2026-05-23 (70 parsed); `day_time` 2026-02-28 to 2026-05-23 (70 parsed)
- Headers/fields: `is_ai_generated, feedback_type, service_id, description, exposure_uri, condition_id, msg_id, update_time, create_time, is_viewed, tag, category, title, deviceuuid, pkg_name, datauuid, day_time`
- Important columns: `is_ai_generated, is_viewed`
- Possible timestamp columns: `update_time, create_time, day_time`
- Possible value columns: `is_ai_generated, is_viewed`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Not a primary dashboard table; parse only for metadata, references, or future support.
- Anonymized sample row:
```json
{
  "is_ai_generated": "0",
  "feedback_type": "0",
  "service_id": "[MASKED_ID]",
  "description": "[MASKED_TEXT]",
  "exposure_uri": "[MASKED_TEXT]",
  "condition_id": "[MASKED_ID]",
  "msg_id": "[MASKED_ID]",
  "update_time": "2026-02-28 01:29:47.887",
  "create_time": "2026-02-28 01:29:47.887",
  "is_viewed": "0",
  "tag": "[MASKED_ID]",
  "category": "VS_VITALITYSCORE",
  "title": "[MASKED_TEXT]",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.mindfulness.history.20260523103346.csv`
- Detected category: Stress/recovery
- Confidence: Medium
- Row count: 2
- Date range: `start_time` 2025-10-26 to 2025-11-04 (2 parsed); `update_time` 2025-10-26 to 2025-11-04 (2 parsed); `create_time` 2025-10-26 to 2025-11-04 (2 parsed); `end_time` 2025-10-26 to 2025-11-04 (2 parsed)
- Headers/fields: `duration, create_sh_ver, track_content_id, start_time, stress_device_id, modify_sh_ver, update_time, create_time, mood, type, time_offset, deviceuuid, program_title, pkg_name, track_title, end_time, datauuid, program_content_id`
- Important columns: `duration`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset, end_time`
- Possible value columns: `duration`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `mood` 2/2
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "duration": "68206",
  "create_sh_ver": "63051050",
  "track_content_id": "[MASKED_ID]",
  "start_time": "2025-10-26 03:05:24.345",
  "stress_device_id": "[MASKED_ID]",
  "modify_sh_ver": "63051050",
  "update_time": "2025-10-26 03:06:34.641",
  "create_time": "2025-10-26 03:06:34.641",
  "mood": "",
  "type": "3",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "program_title": "[MASKED_TEXT]",
  "pkg_name": "[MASKED_ID]",
  "track_title": "[MASKED_TEXT]",
  "end_time": "2025-10-26 03:06:34.624"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.mood.20260523103346.csv`
- Detected category: Stress/recovery
- Confidence: Medium
- Row count: 3
- Date range: `start_time` 2025-10-26 to 2026-03-05 (3 parsed); `update_time` 2025-10-26 to 2026-03-05 (3 parsed); `create_time` 2025-10-26 to 2026-03-05 (3 parsed)
- Headers/fields: `create_sh_ver, start_time, factors, mood_type, modify_sh_ver, update_time, create_time, data_version, notes, place, time_offset, deviceuuid, company, pkg_name, emotions, datauuid`
- Important columns: `factors`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset`
- Possible value columns: `factors`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `notes` 3/3; `place` 3/3; `company` 3/3; `factors` 1/3; `emotions` 1/3
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "63051050",
  "start_time": "2025-10-26 03:01:35.766",
  "factors": "",
  "mood_type": "3",
  "modify_sh_ver": "63051050",
  "update_time": "2025-10-26 03:01:35.778",
  "create_time": "2025-10-26 03:01:35.778",
  "data_version": "2",
  "notes": "",
  "place": "",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "company": "",
  "pkg_name": "[MASKED_ID]",
  "emotions": "",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.preferences.20260523103346.csv`
- Detected category: Device/source metadata
- Confidence: Medium
- Row count: 77
- Date range: `update_time` 2025-09-11 to 2026-05-23 (77 parsed); `create_time` 2025-09-11 to 2026-05-18 (77 parsed)
- Headers/fields: `text_value, service_id, float_value, update_time, create_time, long_value, tag, blob_value, int_value, deviceuuid, pkg_name, double_value, datauuid`
- Important columns: `text_value, float_value, long_value, int_value`
- Possible timestamp columns: `update_time, create_time`
- Possible value columns: `text_value, float_value, long_value, int_value`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `tag` 77/77; `double_value` 77/77; `float_value` 76/77; `blob_value` 72/77; `text_value` 65/77; `long_value` 56/77
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Not a primary dashboard table; parse only for metadata, references, or future support.
- Anonymized sample row:
```json
{
  "text_value": "",
  "service_id": "",
  "float_value": "",
  "update_time": "2026-04-23 03:22:16.778",
  "create_time": "2026-02-27 18:23:36.547",
  "long_value": "",
  "tag": "",
  "blob_value": "",
  "int_value": "1",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "double_value": "",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.program.sleep_coaching.mission.20260523103346.csv`
- Detected category: Sleep
- Confidence: High
- Row count: 315
- Date range: `update_time` 2025-11-01 to 2026-05-11 (315 parsed); `create_time` 2025-11-01 to 2026-04-19 (315 parsed)
- Headers/fields: `create_sh_ver, answer, priority, modify_sh_ver, update_time, create_time, data_version, day_index, mission_id, deviceuuid, pkg_name, is_key_habit, session_id, datauuid, is_done`
- Important columns: `priority, day_index, is_key_habit, is_done`
- Possible timestamp columns: `update_time, create_time, day_index`
- Possible value columns: `priority, day_index, is_key_habit, is_done`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "63051050",
  "answer": "null",
  "priority": "9",
  "modify_sh_ver": "63051050",
  "update_time": "2025-11-01 16:24:18.735",
  "create_time": "2025-11-01 16:24:18.735",
  "data_version": "2",
  "day_index": "0",
  "mission_id": "[MASKED_ID]",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "is_key_habit": "0",
  "session_id": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]",
  "is_done": "0"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.program.sleep_coaching.session.20260523103346.csv`
- Detected category: Sleep
- Confidence: Low
- Row count: 2
- Date range: `start_date` 2025-11-02 to 2026-04-21 (2 parsed); `update_time` 2025-11-23 to 2026-05-13 (2 parsed); `create_time` 2025-11-01 to 2026-04-19 (2 parsed); `end_date` 2025-11-22 to 2026-05-11 (2 parsed)
- Headers/fields: `create_sh_ver, mission_count, is_report_read, start_date, survey, modify_sh_ver, update_time, create_time, data_version, type, deviceuuid, contents_version, pkg_name, end_date, datauuid`
- Important columns: `mission_count, is_report_read`
- Possible timestamp columns: `start_date, update_time, create_time, end_date`
- Possible value columns: `mission_count, is_report_read`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "63051050",
  "mission_count": "189",
  "is_report_read": "1",
  "start_date": "2025-11-02 00:00:00.000",
  "survey": "[MASKED_ID].survey.json",
  "modify_sh_ver": "63051050",
  "update_time": "2025-11-23 03:41:06.417",
  "create_time": "2025-11-01 16:24:18.831",
  "data_version": "3",
  "type": "5",
  "deviceuuid": "[MASKED_ID]",
  "contents_version": "3",
  "pkg_name": "[MASKED_ID]",
  "end_date": "2025-11-22 00:00:00.000",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.service_preferences.20260523103346.csv`
- Detected category: Device/source metadata
- Confidence: Medium
- Row count: 17
- Date range: `update_time` 2026-02-27 to 2026-05-23 (17 parsed); `create_time` 2026-02-26 to 2026-05-16 (17 parsed)
- Headers/fields: `text_value, service_id, float_value, update_time, create_time, long_value, key, tag, blob_value, int_value, deviceuuid, pkg_name, double_value, datauuid`
- Important columns: `long_value, int_value`
- Possible timestamp columns: `update_time, create_time`
- Possible value columns: `long_value, int_value`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `float_value` 17/17; `tag` 17/17; `double_value` 17/17; `blob_value` 16/17; `text_value` 15/17; `int_value` 11/17
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Not a primary dashboard table; parse only for metadata, references, or future support.
- Anonymized sample row:
```json
{
  "text_value": "",
  "service_id": "",
  "float_value": "",
  "update_time": "2026-02-27 18:23:42.346",
  "create_time": "2026-02-27 18:23:42.346",
  "long_value": "",
  "key": "oobe.completed",
  "tag": "",
  "blob_value": "",
  "int_value": "1",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "double_value": "",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.sleep.20260523103346.csv`
- Detected category: Sleep
- Confidence: High
- Row count: 392
- Date range: `com.samsung.health.sleep.start_time` 2025-09-11 to 2026-05-22 (392 parsed); `com.samsung.health.sleep.update_time` 2025-09-12 to 2026-05-23 (392 parsed); `com.samsung.health.sleep.create_time` 2025-09-12 to 2026-05-23 (392 parsed); `com.samsung.health.sleep.end_time` 2025-09-12 to 2026-05-23 (392 parsed); `original_wake_up_time` 2025-09-14 to 2026-05-17 (91 parsed)
- Headers/fields: `total_sleep_time_weight, original_efficiency, mental_recovery, wake_score, factor_01, factor_02, factor_03, factor_04, factor_05, factor_06, factor_07, factor_08, factor_09, factor_10, deep_score, integrated_id, latency_weight, has_sleep_data, bedtime_detection_delay, sleep_efficiency_with_latency, wakeup_time_detection_delay, total_rem_duration, combined_id, nap_score, sleep_type, sleep_latency, data_version, latency_score, deep_weight, rem_weight, physical_recovery, original_wake_up_time, movement_awakening, is_integrated, original_bed_time, goal_bed_time, quality, extra_data, wake_weight, rem_score, goal_wake_up_time, sleep_cycle, total_light_duration, efficiency, sleep_score, sleep_duration, stage_analyzed_type, total_sleep_time_score, com.samsung.health.sleep.create_sh_ver, com.samsung.health.sleep.start_time, com.samsung.health.sleep.custom, com.samsung.health.sleep.modify_sh_ver, com.samsung.health.sleep.update_time, com.samsung.health.sleep.create_time, com.samsung.health.sleep.client_data_id, com.samsung.health.sleep.client_data_ver, com.samsung.health.sleep.time_offset, com.samsung.health.sleep.deviceuuid, com.samsung.health.sleep.comment, com.samsung.health.sleep.pkg_name, com.samsung.health.sleep.end_time, com.samsung.health.sleep.datauuid`
- Important columns: `wake_score, factor_01, factor_02, factor_03, factor_04, factor_05, factor_06, factor_07, factor_08, factor_09, deep_score, latency_weight`
- Possible timestamp columns: `total_sleep_time_weight, bedtime_detection_delay, wakeup_time_detection_delay, original_wake_up_time, original_bed_time, goal_bed_time, goal_wake_up_time, total_sleep_time_score, com.samsung.health.sleep.start_time, com.samsung.health.sleep.update_time, com.samsung.health.sleep.create_time, com.samsung.health.sleep.time_offset, com.samsung.health.sleep.end_time`
- Possible value columns: `wake_score, factor_01, factor_02, factor_03, factor_04, factor_05, factor_06, factor_07, factor_08, factor_09, deep_score, latency_weight`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `original_efficiency` 392/392; `factor_10` 392/392; `integrated_id` 392/392; `is_integrated` 392/392; `extra_data` 392/392; `com.samsung.health.sleep.custom` 392/392
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "total_sleep_time_weight": "34",
  "original_efficiency": "",
  "mental_recovery": "50.0",
  "wake_score": "6",
  "factor_01": "24",
  "factor_02": "32",
  "factor_03": "7",
  "factor_04": "1",
  "factor_05": "13",
  "factor_06": "181",
  "factor_07": "119",
  "factor_08": "0",
  "factor_09": "3",
  "factor_10": "",
  "deep_score": "15",
  "integrated_id": ""
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.sleep_combined.20260523103346.csv`
- Detected category: Sleep
- Confidence: High
- Row count: 83
- Date range: `start_time` 2025-09-17 to 2026-05-20 (83 parsed); `update_time` 2025-09-18 to 2026-05-21 (83 parsed); `create_time` 2025-09-18 to 2026-05-21 (83 parsed); `end_time` 2025-09-18 to 2026-05-21 (83 parsed)
- Headers/fields: `total_sleep_time_weight, original_efficiency, create_sh_ver, start_time, mental_recovery, wake_score, factor_01, factor_02, factor_03, factor_04, factor_05, factor_06, factor_07, factor_08, factor_09, factor_10, deep_score, latency_weight, has_sleep_data, sleep_efficiency_with_latency, total_rem_duration, modify_sh_ver, update_time, nap_score, create_time, client_data_id, sleep_type, data_version, latency_score, deep_weight, rem_weight, physical_recovery, original_wake_up_time, client_data_ver, movement_awakening, original_bed_time, goal_bed_time, quality, time_offset, extra_data, wake_weight, deviceuuid, rem_score, goal_wake_up_time, sleep_cycle, total_light_duration, efficiency, sleep_score, pkg_name, sleep_duration, stage_analyzed_type, end_time, datauuid, stage_analysis_type, total_sleep_time_score`
- Important columns: `wake_score, factor_01, factor_02, factor_03, factor_04, factor_05, factor_06, factor_07, factor_08, factor_09, deep_score, latency_weight`
- Possible timestamp columns: `total_sleep_time_weight, start_time, update_time, create_time, original_wake_up_time, original_bed_time, goal_bed_time, time_offset, goal_wake_up_time, end_time, total_sleep_time_score`
- Possible value columns: `wake_score, factor_01, factor_02, factor_03, factor_04, factor_05, factor_06, factor_07, factor_08, factor_09, deep_score, latency_weight`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `original_efficiency` 83/83; `factor_10` 83/83; `client_data_id` 83/83; `sleep_type` 83/83; `original_wake_up_time` 83/83; `client_data_ver` 83/83
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "total_sleep_time_weight": "34",
  "original_efficiency": "",
  "create_sh_ver": "63070030",
  "start_time": "2026-02-26 18:10:00.000",
  "mental_recovery": "75.0",
  "wake_score": "2",
  "factor_01": "24",
  "factor_02": "61",
  "factor_03": "7",
  "factor_04": "2",
  "factor_05": "71",
  "factor_06": "447",
  "factor_07": "119",
  "factor_08": "0",
  "factor_09": "117",
  "factor_10": ""
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.sleep_goal.20260523103346.csv`
- Detected category: Sleep
- Confidence: Low
- Row count: 1
- Date range: `update_time` 2026-02-07 to 2026-02-07 (1 parsed); `create_time` 2026-02-07 to 2026-02-07 (1 parsed); `set_time` 2026-02-07 to 2026-02-07 (1 parsed)
- Headers/fields: `create_sh_ver, modify_sh_ver, update_time, create_time, sleep_time, wake_up_time, deviceuuid, pkg_name, bed_time, set_time, datauuid`
- Important columns: `create_sh_ver, modify_sh_ver, update_time, create_time, sleep_time, wake_up_time, deviceuuid, pkg_name`
- Possible timestamp columns: `update_time, create_time, sleep_time, wake_up_time, bed_time, set_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "63070030",
  "modify_sh_ver": "63070030",
  "update_time": "2026-02-07 11:55:46.320",
  "create_time": "2026-02-07 11:55:46.320",
  "sleep_time": "26400000",
  "wake_up_time": "26400000",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "bed_time": "0",
  "set_time": "2026-02-07 11:55:46.307",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.sleep_raw_data.20260523103346.csv`
- Detected category: Sleep
- Confidence: Low
- Row count: 9
- Date range: `update_time` 2026-05-17 to 2026-05-23 (9 parsed); `create_time` 2026-05-17 to 2026-05-23 (9 parsed)
- Headers/fields: `create_sh_ver, modify_sh_ver, update_time, create_time, sleep_uuid, data, version, deviceuuid, pkg_name, datauuid`
- Important columns: `create_sh_ver, modify_sh_ver, update_time, create_time, sleep_uuid, data, version, deviceuuid`
- Possible timestamp columns: `update_time, create_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "63110011",
  "modify_sh_ver": "63110011",
  "update_time": "2026-05-17 05:18:40.722",
  "create_time": "2026-05-17 05:18:40.722",
  "sleep_uuid": "[MASKED_ID]",
  "data": "[MASKED_ID].data.json",
  "version": "2",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.social.public_challenge.20260523103346.csv`
- Detected category: Unknown/unsupported
- Confidence: Low
- Row count: 1
- Date range: `update_time` 2026-04-24 to 2026-04-24 (1 parsed); `create_time` 2026-03-03 to 2026-03-03 (1 parsed)
- Headers/fields: `update_time, create_time, body, deviceuuid, pkg_name, last_sync_time, datauuid`
- Important columns: `update_time, create_time, body, deviceuuid, pkg_name, last_sync_time, datauuid`
- Possible timestamp columns: `update_time, create_time, last_sync_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Not a primary dashboard table; parse only for metadata, references, or future support.
- Anonymized sample row:
```json
{
  "update_time": "2026-04-24 14:26:34.496",
  "create_time": "2026-03-03 10:03:56.077",
  "body": "[MASKED_ID].body.json",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "last_sync_time": "0",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.social.public_challenge.detail.20260523103346.csv`
- Detected category: Unknown/unsupported
- Confidence: Low
- Row count: 1
- Date range: `update_time` 2026-04-22 to 2026-04-22 (1 parsed); `create_time` 2026-04-22 to 2026-04-22 (1 parsed); `last_sync_time` 2026-04-22 to 2026-04-22 (1 parsed)
- Headers/fields: `status, update_time, create_time, body, pcid, deviceuuid, pkg_name, last_sync_time, datauuid`
- Important columns: `status, update_time, create_time, body, pcid, deviceuuid, pkg_name, last_sync_time`
- Possible timestamp columns: `update_time, create_time, last_sync_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Not a primary dashboard table; parse only for metadata, references, or future support.
- Anonymized sample row:
```json
{
  "status": "0",
  "update_time": "2026-04-22 07:18:35.215",
  "create_time": "2026-04-22 07:18:34.817",
  "body": "[MASKED_ID].body.json",
  "pcid": "[MASKED_ID]",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "last_sync_time": "1776842315204",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.social.public_challenge.history.20260523103346.csv`
- Detected category: Unknown/unsupported
- Confidence: Low
- Row count: 1
- Date range: `update_time` 2026-04-24 to 2026-04-24 (1 parsed); `create_time` 2026-03-03 to 2026-03-03 (1 parsed); `last_sync_time` 2026-04-24 to 2026-04-24 (1 parsed)
- Headers/fields: `update_time, create_time, body, challenge_time, deviceuuid, pkg_name, last_sync_time, datauuid`
- Important columns: `update_time, create_time, body, challenge_time, deviceuuid, pkg_name, last_sync_time, datauuid`
- Possible timestamp columns: `update_time, create_time, challenge_time, last_sync_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Not a primary dashboard table; parse only for metadata, references, or future support.
- Anonymized sample row:
```json
{
  "update_time": "2026-04-24 14:26:34.848",
  "create_time": "2026-03-03 10:03:57.612",
  "body": "[MASKED_ID].body.json",
  "challenge_time": "SIMPLE_LEVEL",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "last_sync_time": "1777040794845",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.social.service_status.20260523103346.csv`
- Detected category: Device/source metadata
- Confidence: Medium
- Row count: 4
- Date range: `update_time` 2026-03-03 to 2026-05-23 (4 parsed); `create_time` 2026-03-03 to 2026-05-23 (4 parsed)
- Headers/fields: `status, update_time, create_time, service_type, deviceuuid, pkg_name, datauuid`
- Important columns: `status, update_time, create_time, service_type, deviceuuid, pkg_name, datauuid`
- Possible timestamp columns: `update_time, create_time`
- Possible value columns: `none confidently detected`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "status": "0",
  "update_time": "2026-05-23 04:56:35.551",
  "create_time": "2026-03-03 10:03:46.793",
  "service_type": "1",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.step_daily_trend.20260523103346.csv`
- Detected category: Steps/activity
- Confidence: High
- Row count: 736
- Date range: `update_time` 2026-02-27 to 2026-05-23 (736 parsed); `create_time` 2026-02-27 to 2026-05-22 (736 parsed); `day_time` 2025-09-11 to 2026-05-23 (736 parsed)
- Headers/fields: `binning_data, update_time, create_time, source_pkg_name, source_type, count, speed, distance, calorie, deviceuuid, pkg_name, datauuid, day_time`
- Important columns: `count, speed, distance, calorie`
- Possible timestamp columns: `update_time, create_time, day_time`
- Possible value columns: `count, speed, distance, calorie`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "binning_data": "[MASKED_ID].binning_data.json",
  "update_time": "2026-02-27 18:24:50.992",
  "create_time": "2026-02-27 18:24:50.992",
  "source_pkg_name": "[MASKED_ID]",
  "source_type": "[MASKED_ID]",
  "count": "18",
  "speed": "1.8072124",
  "distance": "14.163826",
  "calorie": "0.60618186",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]",
  "day_time": "1757548800000"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.stress.20260523103346.csv`
- Detected category: Stress/recovery
- Confidence: Medium
- Row count: 11
- Date range: `start_time` 2025-09-30 to 2026-05-23 (11 parsed); `update_time` 2025-09-30 to 2026-05-23 (11 parsed); `create_time` 2025-09-30 to 2026-05-23 (11 parsed); `end_time` 2025-09-30 to 2026-05-23 (11 parsed)
- Headers/fields: `create_sh_ver, start_time, custom, binning_data, tag_id, modify_sh_ver, update_time, create_time, max, min, score, algorithm, time_offset, deviceuuid, comment, pkg_name, end_time, datauuid`
- Important columns: `score`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset, end_time`
- Possible value columns: `score`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `custom` 11/11; `binning_data` 11/11; `max` 11/11; `min` 11/11; `algorithm` 11/11; `comment` 11/11
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "62910051",
  "start_time": "2025-09-30 13:49:30.735",
  "custom": "",
  "binning_data": "",
  "tag_id": "[MASKED_ID]",
  "modify_sh_ver": "62910051",
  "update_time": "2025-09-30 13:49:30.958",
  "create_time": "2025-09-30 13:49:30.958",
  "max": "",
  "min": "",
  "score": "25.0",
  "algorithm": "",
  "time_offset": "UTC+0530",
  "deviceuuid": "[MASKED_ID]",
  "comment": "",
  "pkg_name": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.stress.histogram.20260523103346.csv`
- Detected category: Stress/recovery
- Confidence: Medium
- Row count: 3
- Date range: `update_time` 2025-11-06 to 2026-05-23 (3 parsed); `create_time` 2025-09-30 to 2026-04-19 (3 parsed); `decay_time` 2025-11-06 to 2026-05-23 (3 parsed)
- Headers/fields: `update_time, create_time, base_hr, decay_time, deviceuuid, pkg_name, histogram, datauuid`
- Important columns: `base_hr`
- Possible timestamp columns: `update_time, create_time, decay_time`
- Possible value columns: `base_hr`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "update_time": "2025-11-06 02:08:32.806",
  "create_time": "2025-09-30 13:49:30.816",
  "base_hr": "84930",
  "decay_time": "1762394911",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "histogram": "[MASKED_ID].histogram.json",
  "datauuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.tracker.floors_day_summary.20260523103346.csv`
- Detected category: Steps/activity
- Confidence: High
- Row count: 241
- Date range: `update_time` 2025-09-11 to 2026-05-23 (241 parsed); `create_time` 2025-09-11 to 2026-05-23 (241 parsed); `day_time` 2025-09-11 to 2026-05-23 (241 parsed)
- Headers/fields: `create_sh_ver, binning_data, modify_sh_ver, update_time, create_time, floor_count, version_code, deviceuuid, pkg_name, datauuid, day_time`
- Important columns: `floor_count`
- Possible timestamp columns: `update_time, create_time, day_time`
- Possible value columns: `floor_count`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "63070030",
  "binning_data": "[MASKED_ID].binning_data.json",
  "modify_sh_ver": "63110130",
  "update_time": "2026-03-25 03:18:19.124",
  "create_time": "2026-02-27 18:23:52.273",
  "floor_count": "16",
  "version_code": "2",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "datauuid": "[MASKED_ID]",
  "day_time": "1772150400000"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.tracker.heart_rate.20260523103346.csv`
- Detected category: Heart rate
- Confidence: High
- Row count: 11580
- Date range: `com.samsung.health.heart_rate.start_time` 2025-09-11 to 2026-05-23 (11580 parsed); `com.samsung.health.heart_rate.update_time` 2025-09-11 to 2026-05-23 (11580 parsed); `com.samsung.health.heart_rate.create_time` 2025-09-11 to 2026-05-23 (11580 parsed); `com.samsung.health.heart_rate.end_time` 2025-09-11 to 2026-05-23 (11580 parsed)
- Headers/fields: `source, tag_id, com.samsung.health.heart_rate.create_sh_ver, com.samsung.health.heart_rate.heart_beat_count, com.samsung.health.heart_rate.start_time, com.samsung.health.heart_rate.custom, com.samsung.health.heart_rate.binning_data, com.samsung.health.heart_rate.modify_sh_ver, com.samsung.health.heart_rate.update_time, com.samsung.health.heart_rate.create_time, com.samsung.health.heart_rate.client_data_id, com.samsung.health.heart_rate.max, com.samsung.health.heart_rate.min, com.samsung.health.heart_rate.client_data_ver, com.samsung.health.heart_rate.time_offset, com.samsung.health.heart_rate.deviceuuid, com.samsung.health.heart_rate.comment, com.samsung.health.heart_rate.pkg_name, com.samsung.health.heart_rate.end_time, com.samsung.health.heart_rate.datauuid, com.samsung.health.heart_rate.heart_rate`
- Important columns: `com.samsung.health.heart_rate.heart_beat_count, com.samsung.health.heart_rate.max, com.samsung.health.heart_rate.min, com.samsung.health.heart_rate.heart_rate`
- Possible timestamp columns: `com.samsung.health.heart_rate.start_time, com.samsung.health.heart_rate.update_time, com.samsung.health.heart_rate.create_time, com.samsung.health.heart_rate.time_offset, com.samsung.health.heart_rate.end_time`
- Possible value columns: `com.samsung.health.heart_rate.heart_beat_count, com.samsung.health.heart_rate.max, com.samsung.health.heart_rate.min, com.samsung.health.heart_rate.heart_rate`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `source` 11580/11580; `com.samsung.health.heart_rate.custom` 11580/11580; `com.samsung.health.heart_rate.client_data_id` 11580/11580; `com.samsung.health.heart_rate.client_data_ver` 11580/11580; `com.samsung.health.heart_rate.comment` 11580/11580; `com.samsung.health.heart_rate.binning_data` 9494/11580
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Medium
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "source": "",
  "tag_id": "[MASKED_ID]",
  "com.samsung.health.heart_rate.create_sh_ver": "62910051",
  "com.samsung.health.heart_rate.heart_beat_count": "1",
  "com.samsung.health.heart_rate.start_time": "2026-02-26 15:30:00.000",
  "com.samsung.health.heart_rate.custom": "",
  "com.samsung.health.heart_rate.binning_data": "[MASKED_ID].com.samsung.health.heart_rate.binning_data.json",
  "com.samsung.health.heart_rate.modify_sh_ver": "62910051",
  "com.samsung.health.heart_rate.update_time": "2026-02-26 16:34:48.399",
  "com.samsung.health.heart_rate.create_time": "2026-02-26 16:02:31.232",
  "com.samsung.health.heart_rate.client_data_id": "",
  "com.samsung.health.heart_rate.max": "90.0",
  "com.samsung.health.heart_rate.min": "75.0",
  "com.samsung.health.heart_rate.client_data_ver": "",
  "com.samsung.health.heart_rate.time_offset": "UTC+0530",
  "com.samsung.health.heart_rate.deviceuuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.tracker.oxygen_saturation.20260523103346.csv`
- Detected category: Blood oxygen / SpO2
- Confidence: High
- Row count: 370
- Date range: `com.samsung.health.oxygen_saturation.start_time` 2025-09-11 to 2026-05-22 (370 parsed); `com.samsung.health.oxygen_saturation.update_time` 2025-09-12 to 2026-05-23 (370 parsed); `com.samsung.health.oxygen_saturation.create_time` 2025-09-12 to 2026-05-23 (370 parsed); `com.samsung.health.oxygen_saturation.end_time` 2025-09-12 to 2026-05-23 (370 parsed)
- Headers/fields: `integrated_id, source, tag_id, coverage_rate, com.samsung.health.oxygen_saturation.create_sh_ver, com.samsung.health.oxygen_saturation.start_time, com.samsung.health.oxygen_saturation.custom, com.samsung.health.oxygen_saturation.modify_sh_ver, com.samsung.health.oxygen_saturation.update_time, com.samsung.health.oxygen_saturation.create_time, com.samsung.health.oxygen_saturation.client_data_id, com.samsung.health.oxygen_saturation.low_duration, com.samsung.health.oxygen_saturation.binning, com.samsung.health.oxygen_saturation.max, com.samsung.health.oxygen_saturation.min, com.samsung.health.oxygen_saturation.spo2, com.samsung.health.oxygen_saturation.client_data_ver, com.samsung.health.oxygen_saturation.time_offset, com.samsung.health.oxygen_saturation.deviceuuid, com.samsung.health.oxygen_saturation.comment, com.samsung.health.oxygen_saturation.pkg_name, com.samsung.health.oxygen_saturation.end_time, com.samsung.health.oxygen_saturation.datauuid, com.samsung.health.oxygen_saturation.heart_rate`
- Important columns: `com.samsung.health.oxygen_saturation.low_duration, com.samsung.health.oxygen_saturation.max, com.samsung.health.oxygen_saturation.min, com.samsung.health.oxygen_saturation.spo2`
- Possible timestamp columns: `com.samsung.health.oxygen_saturation.start_time, com.samsung.health.oxygen_saturation.update_time, com.samsung.health.oxygen_saturation.create_time, com.samsung.health.oxygen_saturation.time_offset, com.samsung.health.oxygen_saturation.end_time`
- Possible value columns: `com.samsung.health.oxygen_saturation.low_duration, com.samsung.health.oxygen_saturation.max, com.samsung.health.oxygen_saturation.min, com.samsung.health.oxygen_saturation.spo2`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `integrated_id` 370/370; `source` 370/370; `com.samsung.health.oxygen_saturation.custom` 370/370; `com.samsung.health.oxygen_saturation.client_data_id` 370/370; `com.samsung.health.oxygen_saturation.client_data_ver` 370/370; `com.samsung.health.oxygen_saturation.comment` 370/370
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "integrated_id": "",
  "source": "",
  "tag_id": "[MASKED_ID]",
  "coverage_rate": "",
  "com.samsung.health.oxygen_saturation.create_sh_ver": "62910051",
  "com.samsung.health.oxygen_saturation.start_time": "2025-09-13 21:18:00.000",
  "com.samsung.health.oxygen_saturation.custom": "",
  "com.samsung.health.oxygen_saturation.modify_sh_ver": "62910051",
  "com.samsung.health.oxygen_saturation.update_time": "2025-09-14 04:55:17.143",
  "com.samsung.health.oxygen_saturation.create_time": "2025-09-14 04:55:17.143",
  "com.samsung.health.oxygen_saturation.client_data_id": "",
  "com.samsung.health.oxygen_saturation.low_duration": "265",
  "com.samsung.health.oxygen_saturation.binning": "[MASKED_ID].com.samsung.health.oxygen_saturation.binning.json",
  "com.samsung.health.oxygen_saturation.max": "100.0",
  "com.samsung.health.oxygen_saturation.min": "74.0",
  "com.samsung.health.oxygen_saturation.spo2": "92.0"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.tracker.pedometer_day_summary.20260523103346.csv`
- Detected category: Steps/activity
- Confidence: High
- Row count: 737
- Date range: `update_time` 2025-09-11 to 2026-05-23 (737 parsed); `create_time` 2025-09-11 to 2026-05-22 (737 parsed); `day_time` 2025-09-11 to 2026-05-23 (737 parsed)
- Headers/fields: `create_sh_ver, step_count, binning_data, active_time, recommendation, modify_sh_ver, run_step_count, update_time, source_package_name, create_time, source_info, speed, distance, calorie, walk_step_count, deviceuuid, pkg_name, healthy_step, achievement, datauuid, day_time`
- Important columns: `step_count, recommendation, run_step_count, speed, distance, calorie, walk_step_count, healthy_step`
- Possible timestamp columns: `active_time, update_time, create_time, day_time`
- Possible value columns: `step_count, recommendation, run_step_count, speed, distance, calorie, walk_step_count, healthy_step`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `source_info` 484/737
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "63070030",
  "step_count": "11181",
  "binning_data": "[MASKED_ID].binning_data.json",
  "active_time": "6404575",
  "recommendation": "6000",
  "modify_sh_ver": "63070030",
  "run_step_count": "94",
  "update_time": "2026-02-27 18:23:52.915",
  "source_package_name": "[MASKED_ID]",
  "create_time": "2026-02-27 18:23:52.915",
  "source_info": "[MASKED_ID]",
  "speed": "1.3044066",
  "distance": "8354.17",
  "calorie": "413.31",
  "walk_step_count": "11087",
  "deviceuuid": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.tracker.pedometer_step_count.20260523103346.csv`
- Detected category: Steps/activity
- Confidence: High
- Row count: 8168
- Date range: `com.samsung.health.step_count.start_time` 2026-04-18 to 2026-05-23 (8168 parsed); `com.samsung.health.step_count.update_time` 2026-04-18 to 2026-05-23 (8168 parsed); `com.samsung.health.step_count.create_time` 2026-04-18 to 2026-05-23 (8168 parsed); `com.samsung.health.step_count.end_time` 2026-04-18 to 2026-05-23 (8168 parsed)
- Headers/fields: `duration, version_code, run_step, walk_step, com.samsung.health.step_count.start_time, com.samsung.health.step_count.sample_position_type, com.samsung.health.step_count.custom, com.samsung.health.step_count.update_time, com.samsung.health.step_count.create_time, com.samsung.health.step_count.count, com.samsung.health.step_count.speed, com.samsung.health.step_count.distance, com.samsung.health.step_count.calorie, com.samsung.health.step_count.time_offset, com.samsung.health.step_count.deviceuuid, com.samsung.health.step_count.pkg_name, com.samsung.health.step_count.end_time, com.samsung.health.step_count.datauuid`
- Important columns: `duration, run_step, walk_step, com.samsung.health.step_count.count, com.samsung.health.step_count.speed, com.samsung.health.step_count.distance, com.samsung.health.step_count.calorie`
- Possible timestamp columns: `com.samsung.health.step_count.start_time, com.samsung.health.step_count.update_time, com.samsung.health.step_count.create_time, com.samsung.health.step_count.time_offset, com.samsung.health.step_count.end_time`
- Possible value columns: `duration, run_step, walk_step, com.samsung.health.step_count.count, com.samsung.health.step_count.speed, com.samsung.health.step_count.distance, com.samsung.health.step_count.calorie`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `com.samsung.health.step_count.sample_position_type` 8168/8168; `com.samsung.health.step_count.custom` 8168/8168
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "duration": "29996",
  "version_code": "4",
  "run_step": "22",
  "walk_step": "39",
  "com.samsung.health.step_count.start_time": "2026-04-19 07:46:00.000",
  "com.samsung.health.step_count.sample_position_type": "",
  "com.samsung.health.step_count.custom": "",
  "com.samsung.health.step_count.update_time": "2026-04-19 07:47:02.007",
  "com.samsung.health.step_count.create_time": "2026-04-19 07:46:34.213",
  "com.samsung.health.step_count.count": "61",
  "com.samsung.health.step_count.speed": "1.8833903",
  "com.samsung.health.step_count.distance": "56.49606",
  "com.samsung.health.step_count.calorie": "3.2765527",
  "com.samsung.health.step_count.time_offset": "UTC+0530",
  "com.samsung.health.step_count.deviceuuid": "[MASKED_ID]",
  "com.samsung.health.step_count.pkg_name": "[MASKED_ID]"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.vitality.nap_data.20260523103346.csv`
- Detected category: Sleep
- Confidence: High
- Row count: 31
- Date range: `start_time` 2025-10-19 to 2026-04-21 (31 parsed); `update_time` 2025-10-19 to 2026-04-21 (31 parsed); `create_time` 2025-10-19 to 2026-04-21 (31 parsed); `vitality_day_time` 2025-10-19 to 2026-04-21 (31 parsed); `end_time` 2025-10-19 to 2026-04-21 (31 parsed)
- Headers/fields: `create_sh_ver, start_time, modify_sh_ver, update_time, create_time, time_offset, vitality_day_time, deviceuuid, pkg_name, score_before, end_time, datauuid, score_after`
- Important columns: `score_before, score_after`
- Possible timestamp columns: `start_time, update_time, create_time, time_offset, vitality_day_time, end_time`
- Possible value columns: `score_before, score_after`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: No dominant null columns.
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "create_sh_ver": "63051050",
  "start_time": "2025-10-19 03:13:00.000",
  "modify_sh_ver": "63051050",
  "update_time": "2025-10-19 04:58:54.540",
  "create_time": "2025-10-19 04:58:54.540",
  "time_offset": "UTC+0530",
  "vitality_day_time": "1760832000000",
  "deviceuuid": "[MASKED_ID]",
  "pkg_name": "[MASKED_ID]",
  "score_before": "89.33031",
  "end_time": "2025-10-19 04:58:00.000",
  "datauuid": "[MASKED_ID]",
  "score_after": "92.864815"
}
```

## File: `[EXPORT_ROOT]/com.samsung.shealth.vitality_score.20260523103346.csv`
- Detected category: Stress/recovery
- Confidence: Medium
- Row count: 229
- Date range: `main_sleep_wake_up_time` 2025-09-12 to 2026-05-23 (229 parsed); `update_time` 2025-09-12 to 2026-05-23 (229 parsed); `create_time` 2025-09-12 to 2026-05-23 (229 parsed); `day_time` 2025-09-12 to 2026-05-23 (229 parsed)
- Headers/fields: `activity_level, activity_score, create_sh_ver, active_time_scale, activity_balance_short_term_activity, activity_balance_long_term_activity, shr_balance_scale, mvpa_time_optimal_range_max, mvpa_time_optimal_range_min, max_hr, active_time, shrv_balance_scale, main_sleep_wake_up_time, mvpa_impulse_optimal_range_max, mvpa_impulse_optimal_range_min, shr_baseline_max, shr_baseline_min, shr_calculation_index, mvpa_time, skin_temperature_scale, modify_sh_ver, sleep_balance, update_time, create_time, total_score, data_version, avg_mid_sleep_time, mvpa_time_range_max, mvpa_time_range_min, mvpa_impulse, shrv_calculation_index, sleep_regularity_scale, stable_hr_time_rate, active_time_optimal_range_max, active_time_optimal_range_min, sleep_timing, shr_score, shr_value, mvpa_impulse_scale, sleep_regularity, sleep_timing_scale, prev_shrv_avg, mvpa_time_scale, deviceuuid, sleep_score, sleep_duration_scale, activity_balance, activity_balance_range_max, activity_balance_range_min, mvpa_impulse_range_max, mvpa_impulse_range_min, pkg_name, sleep_balance_scale, shrv_score, shrv_value, sleep_duration, skin_temperature_optimal_range_max, skin_temperature_optimal_range_min, activity_balance_scale, active_time_range_max, active_time_range_min, shrv_baseline_max, shrv_baseline_min, datauuid, prev_shr_avg, day_time, shrv_penalty, activity_balance_optimal_range_max, activity_balance_optimal_range_min`
- Important columns: `activity_level, activity_score, activity_balance_short_term_activity, activity_balance_long_term_activity, shr_balance_scale, max_hr, shrv_balance_scale, mvpa_impulse_optimal_range_max, mvpa_impulse_optimal_range_min, shr_baseline_max, shr_baseline_min, shr_calculation_index`
- Possible timestamp columns: `active_time_scale, mvpa_time_optimal_range_max, mvpa_time_optimal_range_min, active_time, main_sleep_wake_up_time, mvpa_time, update_time, create_time, avg_mid_sleep_time, mvpa_time_range_max, mvpa_time_range_min, stable_hr_time_rate, active_time_optimal_range_max, active_time_optimal_range_min, mvpa_time_scale, active_time_range_max, active_time_range_min, day_time`
- Possible value columns: `activity_level, activity_score, activity_balance_short_term_activity, activity_balance_long_term_activity, shr_balance_scale, max_hr, shrv_balance_scale, mvpa_impulse_optimal_range_max, mvpa_impulse_optimal_range_min, shr_baseline_max, shr_baseline_min, shr_calculation_index`
- Units detected: Inferred from Samsung field names; see section 6.
- Null/missing value behavior: `skin_temperature_scale` 229/229; `skin_temperature_optimal_range_max` 229/229; `skin_temperature_optimal_range_min` 229/229
- Duplicate behavior: 0 exact duplicate rows detected.
- Parsing difficulty: Low
- Notes: Useful for dashboard normalization.
- Anonymized sample row:
```json
{
  "activity_level": "-1",
  "activity_score": "1.0",
  "create_sh_ver": "63030110",
  "active_time_scale": "1.0",
  "activity_balance_short_term_activity": "0.11301945",
  "activity_balance_long_term_activity": "[MASKED_LOCATION]",
  "shr_balance_scale": "55.679813",
  "mvpa_time_optimal_range_max": "120000",
  "mvpa_time_optimal_range_min": "60000",
  "max_hr": "198.0",
  "active_time": "162748",
  "shrv_balance_scale": "86.540695",
  "main_sleep_wake_up_time": "1757673780000",
  "mvpa_impulse_optimal_range_max": "-1.0",
  "mvpa_impulse_optimal_range_min": "0.0",
  "shr_baseline_max": "57.03322"
}
```

## JSON Sidecar Groups

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.health.device_profile/**/*.json`
- Files: 4
- Size: 59.3 KiB
- Parse errors: 0
- Common suffixes: capability=4
- Common top-level keys: `capability_type, sender, receiver, wearable_message, data_sync_support, protocol_version, bluetooth_name, bluetooth_address, model_name, model_number, device_id, temp_device_id, connection_id, device_type, device_category, device_manufacturer, device_feature, wearable_health_version, config, binning`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "capability_type": "com.samsung.shealth.RESPONSE_CAPABILITY",
  "sender": "wearable",
  "receiver": "shealth",
  "wearable_message": "{'message_support': True, 'message_version': 5.03, 'message_compression': True, 'message_compression_format': 'gzip', 'message_size': 6144}",
  "data_sync_support": "True",
  "protocol_version": "4.51",
  "bluetooth_name": "[MASKED_TEXT]",
  "bluetooth_address": "[MASKED_LOCATION]"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.health.floors_climbed/**/*.json`
- Files: 1932
- Size: 115.0 KiB
- Parse errors: 0
- Common suffixes: raw_data=1932
- Common top-level keys: `end_time, floor`
- Date range: `end_time` 2025-09-12 to 2026-05-23 (1932)
- Anonymized sample object:
```json
{
  "end_time": "1766645223000",
  "floor": "1.0"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.health.hrv/**/*.json`
- Files: 1740
- Size: 6.31 MiB
- Parse errors: 0
- Common suffixes: binning_data=1740
- Common top-level keys: `start_time, end_time, sdnn, rmssd`
- Date range: `start_time` 2025-09-11 to 2026-05-23 (1740); `end_time` 2025-09-11 to 2026-05-23 (1740)
- Anonymized sample object:
```json
{
  "start_time": "1768264261549",
  "end_time": "1768264564693",
  "sdnn": "76.681076",
  "rmssd": "88.44886"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.health.movement/**/*.json`
- Files: 5309
- Size: 21.68 MiB
- Parse errors: 0
- Common suffixes: binning_data=5309
- Common top-level keys: `start_time, end_time, activity_level`
- Date range: `start_time` 2025-09-11 to 2026-05-23 (5309); `end_time` 2025-09-11 to 2026-05-23 (5309)
- Anonymized sample object:
```json
{
  "start_time": "1762297200000",
  "end_time": "1762297259999",
  "activity_level": "0.0"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.health.oxygen_saturation.raw/**/*.json`
- Files: 45
- Size: 31.36 MiB
- Parse errors: 0
- Common suffixes: binning_data=45
- Common top-level keys: `time, channel`
- Date range: `time` 2026-04-18 to 2026-05-22 (45)
- Anonymized sample object:
```json
{
  "time": "1777922406782",
  "channel": "0.0"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.health.respiratory_rate/**/*.json`
- Files: 375
- Size: 7.43 MiB
- Parse errors: 0
- Common suffixes: binning_data=375
- Common top-level keys: `start_time, end_time, respiratory_rate`
- Date range: `start_time` 2025-09-11 to 2026-05-22 (375); `end_time` 2025-09-11 to 2026-05-22 (375)
- Anonymized sample object:
```json
{
  "start_time": "1763830200000",
  "end_time": "1763830259999",
  "respiratory_rate": "0.0"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.health.user_profile/**/*.json`
- Files: 1
- Size: 6.4 KiB
- Parse errors: 0
- Common suffixes: dashboard_config=1
- Common top-level keys: `mHServiceIdList, mShownHServiceIdList, mUpdateAppVersion, mUpdateTime`
- Date range: `mUpdateTime` 2026-02-28 to 2026-02-28 (1)
- Anonymized sample object:
```json
{
  "mHServiceIdList": "[MASKED_ID]",
  "mShownHServiceIdList": "[MASKED_ID]",
  "mUpdateAppVersion": "6307003",
  "mUpdateTime": "1772241455255"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.activity.day_summary/**/*.json`
- Files: 310
- Size: 2.98 MiB
- Parse errors: 0
- Common suffixes: extra_data=310
- Common top-level keys: `mAdaptiveGoal, mIsGoalAchieved, mIsMostActiveAchieved, mMostActiveMinutes, mStreakDayCount, version, hourlyDataList, mUnitDataList, mActivityList`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "hourlyDataList": "[{'moveHourly': True, 'startTime': 1761008400000}, {'moveHourly': True, 'startTime': 1761037200000}, {'moveHourly': True, 'startTime': 1761040800000}, {'moveHourly': True, 'startTime': 1761044400000}, {'moveHourly': True, 'startTime': 1761048000000}, {'moveHourly': True, 'startTime': 1761051600000}, {'moveHourly': True, 'startTime': 1761055200000}, {'moveHourly': True, 'startTime': 1761058800000}, {'moveHourly': True, 'startTime': 1761062400000}, {'moveHourly': True, 'startTime': 1761066000000}, {'moveHourly': True, 'startTime': 1761069600000}, {'moveHourly': True, 'startTime': 1761073200000}, {'moveHourly': True, 'startTime': 1761076800000}, {'moveHourly': True, 'startTime': 1761080400000}, {'moveHourly': True, 'startTime': 1761084000000}, {'moveHourly': True, 'startTime': 1761087600000}]",
  "mActivityList": "[{'mActiveTime': 704422, 'mActiveTimeType': 0, 'mCalorie': 51.0, 'mCategory': 204, 'mDetailInfoId': '[MASKED_ID]', 'mDistance': 726.1, 'mDuration': 705325, 'mEndTime': 67675833, 'mStartTime': 66970508, 'mType': 1001}]",
  "mAdaptiveGoal": "0",
  "mIsGoalAchieved": "False",
  "mIsMostActiveAchieved": "False",
  "mMostActiveMinutes": "0",
  "mStreakDayCount": "0",
  "mUnitDataList": "[{'distance': 9.663086, 'dynamicActiveTime': 0, 'exerciseCalorie': 0.0, 'exerciseTime': 0, 'floorCount': 0, 'mCalorie': 0.3659973, 'mOthersTime': 0, 'mRunTime': 0, 'mStartTime': 0, 'mTimeUnit': 600000, 'mWalkTime': 8004, 'runStep': 0, 'walkStep': 12}, {'distance': 53.36, 'dynamicActiveTime': 0, 'exerciseCalorie': 0.0, 'exerciseTime': 0, 'floorCount': 0, 'mCalorie': 2.12, 'mOthersTime': 0, 'mRunTime': 0, 'mStartTime': 5400000, 'mTimeUnit': 600000, 'mWalkTime': 46023, 'runStep': 0, 'walkStep': 69}, {'distance': 66.49101, 'dynamicActiveTime': 0, 'exerciseCalorie': 0
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.calories_burned.details/**/*.json`
- Files: 283
- Size: 65.5 KiB
- Parse errors: 0
- Common suffixes: extra_data=283
- Common top-level keys: `activityLevel, age, gender, height, stepCount, weight, activityList`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "activityLevel": "180003",
  "activityList": "[{'activeTime': 1571601, 'calorie': 133.0, 'distance': 1668.62, 'type': 1001}, {'activeTime': 2936420, 'calorie': 148.98807, 'distance': 3582.8123, 'type': -1}]",
  "age": "23",
  "gender": "M",
  "height": "182.88",
  "stepCount": "6852",
  "weight": "57.5"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.exercise/**/*.json`
- Files: 1505
- Size: 44.30 MiB
- Parse errors: 0
- Common suffixes: live_data=527, sensing_status=491, live_data_internal=485, location_data_internal=1, location_data=1
- Common top-level keys: `start_time, segment, sampling_rate, elapsed_time, interval, speed, source_type, cadence, heart_rate, heart_rate_zone, calorie, distance, advanced_metrics, max_hr, sweat_loss, vo2_max, accuracy, altitude, latitude, longitude`
- Date range: `start_time` 2025-09-12 to 2026-05-22 (1014)
- Anonymized sample object:
```json
{
  "elapsed_time": "1000",
  "interval": "1",
  "segment": "1",
  "source_type": "[MASKED_ID]",
  "start_time": "1761465967474"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.exercise.periodization_training_program/**/*.json`
- Files: 3
- Size: 2.05 MiB
- Parse errors: 0
- Common suffixes: program=3
- Common top-level keys: `configuration, programs, transformer`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "configuration": "{'isMileUnit': False, 'language': 'en', 'userMaxHeartRate': 197, 'version': 10}",
  "programs": "[{'programGuideV2': {'coolDown': {'lap': {'duration': [{'message': '_Cool down start_', 'point': 0, 'popupType': 'START'}, {'message': '_Cool down end_', 'point': 180000, 'popupType': 'NONE'}]}, 'type': 'COOL_DOWN'}, 'version': 2, 'workout': [{'lap': {'duration': [{'message': '_Workout init level test start_', 'point': 0, 'popupType': 'NONE'}, {'message': '_Workout init level test after start 1 min 30 sec_', 'point': 90000, 'popupType': 'AUTO_LAP'}, {'message': '_Workout init level test after start 3 min_', 'point': 180000, 'popupType': 'AUTO_LAP'}, {'message': '_Workout init level test after start 4 min 30 sec_', 'point': 270000, 'popupType': 'AUTO_LAP'}, {'message': '_Workout init level test after start 7 min 30 sec_', 'point': 450000, 'popupType': 'AUTO_LAP'}, {'message': '_Workout init level test after start 9 min_', 'point': 540000, 'popupType': 'AUTO_LAP'}, {'message': '_Workout init level test after start 10 min 30 sec_', 'point': 630000, 'popupType': 'AUTO_LAP'}, {'message': '_Workout init level test before end 30 sec_', 'point': 690000, 'popupType': 'NONE'}]}, 'progress': [{'message': '_Workout init level test after start 6 min_', 'percent': 50, 'popupType': 'PROGRESS'}, {'message': '_Workout 100 percent level test_', 'percent': 100, 'popupType': 'PROGRESS'}], 'type': 'WORKOUT'}]}, 'content': {'coolDown': {'duration': 180000, 'maxHrThreshold': 126, 'targetType': 'NONE', 'type': 'COOL_DOWN', 'workoutType': 'COOL_DOWN'}, 'workout': {'phases': [{'duration': 720000, 'targetType': 'DURATION', 'type': 'WORKOUT', 'workoutType': 'TEST'}], 'repeat': 1, 'totalDuration': 720000}}, 'description': 'init test', 'exerciseType': 1002, 'id': 'program_init_test'
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.exercise.periodization_training_schedule/**/*.json`
- Files: 1
- Size: 22.2 KiB
- Parse errors: 0
- Common suffixes: schedule=1
- Common top-level keys: `coachingTitle, deviceUuid, initLevelTest, name, schedules, stepTitle, survey, version, weeklyCount`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "coachingTitle": "[MASKED_TEXT]",
  "deviceUuid": "[MASKED_ID]",
  "initLevelTest": "{'programId': 'program_init_test', 'scheduleId': 'schedule_init_test'}",
  "name": "[MASKED_TEXT]",
  "schedules": "[{'isExtra': False, 'level': 1, 'mandatory': False, 'programId': '01_01_01_m67boquf_1ky', 'scheduleId': 'm67cdead_2yl', 'session': 1, 'step': 1, 'week': 1}, {'isExtra': False, 'level': 1, 'mandatory': False, 'programId': '01_01_02_m67boqv5_2uc', 'scheduleId': 'm67cdeb3_2o', 'session': 2, 'step': 1, 'week': 1}, {'isExtra': False, 'level': 1, 'mandatory': False, 'programId': '01_01_03_m67boqvp_2ed', 'scheduleId': 'm67cdebn_30m', 'session': 3, 'step': 1, 'week': 1}, {'isExtra': False, 'level': 1, 'mandatory': False, 'programId': '01_01_04_m67boqw9_2pw', 'scheduleId': 'm67cdec7_db', 'session': 4, 'step': 1, 'week': 1}, {'isExtra': False, 'level': 1, 'mandatory': False, 'programId': '01_01_05_m67boqwt_cs', 'scheduleId': 'm67cdecr_1mw', 'session': 5, 'step': 1, 'week': 2}, {'isExtra': False, 'level': 1, 'mandatory': False, 'programId': '01_01_06_m67boqxd_2by', 'scheduleId': 'm67cdedc_151', 'session': 6, 'step': 1, 'week': 2}, {'isExtra': False, 'level': 1, 'mandatory': True, 'programId': '01_01_07_m67boqxy_10w', 'scheduleId': 'm67cdedw_1w', 'session': 7, 'step': 1, 'week': 2}, {'isExtra': False, 'level': 1, 'mandatory': False, 'programId': '01_01_08_m67boqyi_2xo', 'scheduleId': 'm67cdeeg_349', 'session': 8, 'step': 1, 'week': 2}, {'isExtra': False, 'level': 1, 'mandatory': True, 'programId': '01_01_09_m67boqz2_z1', 'scheduleId': 'm67cdef0_w8', 'session': 9, 'step': 1, 'week': 3}, {'isExtra': False, 'level': 1, 'mandatory': False, 'programId': '01_01_10_m67boqzm_3a', 'scheduleId': 'm67cdefl_1ko', 'session': 10, 'step': 1, 'week': 3}, {'isExtra': False, 'level': 1, 'mandatory'
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.exercise.recovery_heart_rate/**/*.json`
- Files: 41
- Size: 171.5 KiB
- Parse errors: 0
- Common suffixes: heart_rate=41
- Common top-level keys: `is_valid, chart_data, sampling_rate`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "is_valid": "[MASKED_ID]"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.preferences/**/*.json`
- Files: 5
- Size: 79.0 KiB
- Parse errors: 0
- Common suffixes: blob_value=5
- Common top-level keys: `goal, is_onboarding_completed, summary_daily_data, last_water_goal_amount, last_water_goal_amount_time, last_water_goal_cup, last_water_goal_cup_time, active_meal_types, update_time`
- Date range: `last_water_goal_amount_time` 2026-05-23 to 2026-05-23 (1); `last_water_goal_cup_time` 2026-05-23 to 2026-05-23 (1); `update_time` 2026-03-04 to 2026-03-04 (1)
- Anonymized sample object:
```json
{
  "goal": "{'5': 1761447695814}",
  "is_onboarding_completed": "True"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.program.sleep_coaching.session/**/*.json`
- Files: 2
- Size: 88 B
- Parse errors: 0
- Common suffixes: survey=2
- Common top-level keys: `rest_days, ssq3, ssq5`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "rest_days": "[1, 7]",
  "ssq3": "False",
  "ssq5": "True"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.service_preferences/**/*.json`
- Files: 1
- Size: 24 B
- Parse errors: 0
- Common suffixes: blob_value=1
- Common top-level keys: `id, value`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "id": "[MASKED_ID]",
  "value": "3"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.sleep_raw_data/**/*.json`
- Files: 9
- Size: 2.25 MiB
- Parse errors: 0
- Common suffixes: data=9
- Common top-level keys: `data, version`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "data": "[{'acc': [0, 264536862, 269979647, 748, 143519, 8193698, 2081776832, 1656927], 'rri_info': [[1, 255, -1], [1, 28, 858], [1, 21, 854], [1, 23, 908], [1, 22, 889], [1, 21, 828], [1, 23, 931], [1, 23, 895], [1, 22, 890], [1, 20, 804], [1, 22, 892], [1, 21, 829], [1, 21, 838], [1, 20, 803], [1, 21, 838], [1, 23, 910], [1, 23, 918], [1, 21, 831], [1, 20, 823], [1, 22, 866], [1, 22, 870], [1, 21, 848], [1, 20, 804]]}, {'acc': [0, 264107247, 269411008, 750, 161459, 8593324, 2081959124, 1617428], 'rri_info': [[1, 21, 851], [1, 24, 936], [1, 22, 896], [1, 19, 770], [1, 20, 797], [1, 23, 890], [1, 22, 906], [1, 22, 880], [1, 22, 875], [1, 24, 961], [1, 24, 960], [1, 23, 921], [1, 23, 890], [1, 22, 916], [1, 22, 858], [1, 23, 934], [1, 23, 899], [1, 21, 853], [1, 25, 986], [1, 26, 1034], [1, 25, 1016], [1, 22, 896], [1, 22, 880], [1, 24, 945], [1, 24, 952], [1, 22, 880], [1, 21, 854], [1, 24, 934], [1, 23, 932], [1, 22, 893], [1, 20, 805], [1, 21, 832], [1, 23, 917]]}, {'acc': [0, 264059635, 270537254, 748, 173385, 8695689, 2079235160, 1697138], 'rri_info': [[1, 24, 938], [1, 22, 888], [1, 23, 905], [1, 22, 904], [1, 24, 955], [1, 23, 921], [1, 21, 830], [1, 21, 841], [1, 24, 950], [1, 22, 879], [1, 21, 853], [1, 24, 969], [1, 26, 1013], [1, 25, 1005], [1, 23, 932], [1, 24, 977], [1, 24, 944], [1, 23, 938], [1, 23, 882], [1, 22, 905], [1, 23, 909], [1, 22, 888], [1, 22, 864], [1, 21, 851], [1, 23, 915], [1, 23, 918], [1, 22, 892], [1, 21, 848], [1, 23, 892], [1, 23, 940], [1, 24, 932], [1, 22, 909], [1, 22, 849]]}, {'acc': [0, 263901839, 269423744, 750, 37770, 7883319, 2065543150, 1699393], 'rri_info': [[1, 22, 916], [1, 23, 904], [1, 22, 866], [1, 21, 837], [1, 21, 864], [1, 23, 904], [1, 22, 892], [1, 21, 833], [1, 21, 851], [1, 23, 911], [1, 22, 858], [1, 21, 856],
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.social.public_challenge/**/*.json`
- Files: 1
- Size: 2.5 KiB
- Parse errors: 0
- Common suffixes: body=1
- Common top-level keys: `pubChals`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "body": "[MASKED_COMPLEX_VALUE]"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.social.public_challenge.detail/**/*.json`
- Files: 1
- Size: 6.4 KiB
- Parse errors: 0
- Common suffixes: body=1
- Common top-level keys: `adsOn, bgImgUrl, cTitle, ciUrl, cid, distr, gMsgX, gMsgY, missn, nextChal, pacemaker, themeImgUrl, ucAnimImgUrl, ucAnimOrient, viImgUrl, favs, pathType, rankings, activityID, appVer`
- Date range: `joinDate` 2026-04-22 to 2026-04-22 (1); `start` 2026-04-01 to 2026-04-01 (1); `startUpcoming` 2026-03-26 to 2026-03-26 (1)
- Anonymized sample object:
```json
{
  "body": "[MASKED_COMPLEX_VALUE]"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.social.public_challenge.history/**/*.json`
- Files: 1
- Size: 44 B
- Parse errors: 0
- Common suffixes: body=1
- Common top-level keys: `lv, maxXp, minXp, xp`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "body": "[MASKED_COMPLEX_VALUE]"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.step_daily_trend/**/*.json`
- Files: 736
- Size: 6.42 MiB
- Parse errors: 0
- Common suffixes: binning_data=736
- Common top-level keys: `calorie, count, distance, speed`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "calorie": "1.9499999284744263",
  "count": "61",
  "distance": "44.70000076293945",
  "speed": "4.17020845413208"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.stress.histogram/**/*.json`
- Files: 3
- Size: 361 B
- Parse errors: 0
- Common suffixes: histogram=3
- Common top-level keys: `version, values`
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{
  "version": "1",
  "values": "[0, 0, 0, 0, 0, 0, 0, 0, 8369, 3412, 4914, 10000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.tracker.floors_day_summary/**/*.json`
- Files: 241
- Size: 68.0 KiB
- Parse errors: 0
- Common suffixes: binning_data=241
- Common top-level keys: ``
- Date range: No parseable timestamp fields detected at top level.
- Anonymized sample object:
```json
{}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.tracker.heart_rate/**/*.json`
- Files: 2086
- Size: 11.01 MiB
- Parse errors: 0
- Common suffixes: binning_data=2086
- Common top-level keys: `heart_rate, heart_rate_max, heart_rate_min, start_time, end_time`
- Date range: `start_time` 2025-09-11 to 2026-05-23 (2086); `end_time` 2025-09-11 to 2026-05-23 (2086)
- Anonymized sample object:
```json
{
  "heart_rate": "75.0",
  "heart_rate_max": "81.0",
  "heart_rate_min": "74.0",
  "start_time": "1776403680000",
  "end_time": "1776403739000"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.tracker.oxygen_saturation/**/*.json`
- Files: 370
- Size: 4.48 MiB
- Parse errors: 0
- Common suffixes: binning=370
- Common top-level keys: `spo2, spo2_max, spo2_min, start_time, end_time, isIrregular`
- Date range: `start_time` 2025-09-11 to 2026-05-22 (370); `end_time` 2025-09-11 to 2026-05-22 (370)
- Anonymized sample object:
```json
{
  "spo2": "96",
  "spo2_max": "99",
  "spo2_min": "94",
  "start_time": "1769387406334",
  "end_time": "1769387465334"
}
```

### JSON group: `[EXPORT_ROOT]/jsons/com.samsung.shealth.tracker.pedometer_day_summary/**/*.json`
- Files: 1727
- Size: 19.70 MiB
- Parse errors: 0
- Common suffixes: achievement=737, binning_data=737, source_info=253
- Common top-level keys: `mBestSteps, mBestStepsDate, mIsGoalAchieved, mNDayStreak, mTarget, mTargetAchievedSteps, mVersionCode, mCalorie, mDistance, mNowHealthyStep, mRunStepCount, mSpeed, mStartTime, mStepCount, mTimeUnit, mTotalActiveTime, mWalkStepCount, mDeviceUuid, mSourceInfoList`
- Date range: `mBestStepsDate` 2025-09-10 to 2026-05-18 (489); `mStartTime` 2025-09-10 to 2026-05-22 (248)
- Anonymized sample object:
```json
{
  "mBestSteps": "14207",
  "mBestStepsDate": "1757874600000",
  "mIsGoalAchieved": "False",
  "mNDayStreak": "0",
  "mTarget": "6000",
  "mTargetAchievedSteps": "14207",
  "mVersionCode": "9"
}
```

# 5. Timestamp and Timezone Analysis

Most CSV timestamp columns are local strings like `YYYY-MM-DD HH:mm:ss.SSS`. Most JSON sidecars use Unix epoch milliseconds. A few fields use Unix seconds, especially social/challenge and stress histogram decay fields. `day_time` fields are often epoch milliseconds at local-calendar midnight or UTC-equivalent day boundaries, depending on table. `time_offset` is commonly `UTC+0530`, which should be treated as the source timezone offset for local strings.

Parsing recommendations: parse CSV local datetime strings with the row `time_offset`; parse 13-digit numeric values as Unix milliseconds and 10-digit numeric values as Unix seconds; keep both `start_time` and `end_time` when present; normalize to UTC internally but preserve the local date used by Samsung for daily charts; never derive daily buckets from UTC alone without applying the source offset.

# 6. Units and Value Normalization

| Metric | Source columns | Observed / inferred unit | Normalization |
|---|---|---|---|
| Heart rate | `heart_rate`, `max`, `min`, JSON `heart_rate` | bpm | Store as bpm integer/float. |
| Steps | `step_count`, `count`, `walk_step`, `run_step` | count | Store as integer counts. |
| Calories | `calorie`, `active_calorie`, `rest_calorie`, `total_calorie` | kcal | Store as kcal float. |
| Distance | `distance` | meters | Store meters; display km/mi by preference. |
| Sleep duration | `sleep_duration`, `total_*_duration`, stage row intervals | minutes in some summary fields, milliseconds in many score/goal fields | Prefer start/end differences; normalize durations to seconds. |
| Exercise duration | `duration`, `com.samsung.health.exercise.duration` | milliseconds | Normalize to seconds. |
| Stress | `score` | Samsung score, likely 0-100 style but sparse | Store raw score with source label. |
| Blood oxygen | `spo2`, `min`, `max` | percent | Store as percent float. |
| Blood pressure | None | N/A | Unsupported for this export. |
| Weight | `weight` | kg based on `user_profile` weight_unit | Store kg. |
| Height | `height` | cm | Store cm. |
| Water | `amount`, `unit_amount` | milliliters inferred from 250-unit entries | Store milliliters. |
| Nutrition/macros | `carbohydrate`, `protein`, `total_fat`, vitamins/minerals | grams for macros; mg/ug likely for micronutrients depending Samsung schema | Store raw plus normalized macro grams; mark micronutrient unit confidence medium. |

# 7. Recommended Internal Data Models

```ts
type Confidence = "high" | "medium" | "low";

interface HeartRateSample {
  timestamp: string;
  bpm: number;
  minBpm?: number;
  maxBpm?: number;
  sourceFile: string;
  sourceDevice?: string;
  confidence: Confidence;
}

interface DailySteps {
  date: string;
  steps: number;
  walkSteps?: number;
  runSteps?: number;
  activeSeconds?: number;
  distanceMeters?: number;
  caloriesKcal?: number;
  sourceFile: string;
  confidence: Confidence;
}

interface SleepSession {
  id?: string;
  startTime: string;
  endTime: string;
  durationSeconds?: number;
  score?: number;
  efficiency?: number;
  stages?: Array<{ startTime: string; endTime: string; stage: string }>;
  sourceFile: string;
  confidence: Confidence;
}

interface ExerciseSession {
  id?: string;
  startTime: string;
  endTime: string;
  exerciseType?: number | string;
  durationSeconds?: number;
  caloriesKcal?: number;
  distanceMeters?: number;
  meanHeartRate?: number;
  maxHeartRate?: number;
  minHeartRate?: number;
  liveSamples?: Array<{ timestamp: string; heartRate?: number; speed?: number; distanceMeters?: number }>;
  sourceFile: string;
  confidence: Confidence;
}

interface StressSample {
  timestamp: string;
  score?: number;
  moodType?: number;
  breathingDurationSeconds?: number;
  sourceFile: string;
  confidence: Confidence;
}

interface BloodOxygenSample {
  startTime: string;
  endTime?: string;
  spo2Percent: number;
  minSpo2Percent?: number;
  maxSpo2Percent?: number;
  lowDurationSeconds?: number;
  sourceFile: string;
  confidence: Confidence;
}

interface BloodPressureSample {
  timestamp: string;
  systolicMmHg: number;
  diastolicMmHg: number;
  pulseBpm?: number;
  sourceFile: string;
  confidence: Confidence;
}

interface BodyMetricSample {
  timestamp: string;
  weightKg?: number;
  heightCm?: number;
  bodyFatPercent?: number;
  bodyFatMassKg?: number;
  skeletalMuscleMassKg?: number;
  totalBodyWaterKg?: number;
  basalMetabolicRateKcal?: number;
  sourceFile: string;
  confidence: Confidence;
}

interface NutritionEntry {
  timestamp: string;
  mealType?: number | string;
  title?: string;
  caloriesKcal?: number;
  carbohydrateGrams?: number;
  proteinGrams?: number;
  fatGrams?: number;
  sugarGrams?: number;
  sodiumMg?: number;
  sourceFile: string;
  confidence: Confidence;
}

interface WaterIntake {
  timestamp: string;
  amountMl: number;
  sourceFile: string;
  confidence: Confidence;
}

interface DataSourceMetadata {
  sourceId?: string;
  manufacturer?: string;
  model?: string;
  appPackage?: string;
  firstSeen?: string;
  lastSeen?: string;
  masked: true;
}

interface ParserWarning {
  severity: "low" | "medium" | "high";
  sourceFile: string;
  code: string;
  message: string;
  rowNumber?: number;
}

```

# 8. Parser Mapping Rules

Category: Heart Rate
- Detection logic: match filename and header patterns.
- Filename patterns: `*heart_rate*.csv`, `jsons/com.samsung.shealth.tracker.heart_rate/**/*.json`, `*hrv*.csv`
- Header patterns: headers containing `heart_rate.start_time`, `heart_rate`, `max`, `min`, `binning_data`
- Required fields: start time and heart_rate
- Optional fields: max/min, JSON binning, HRV sdnn/rmssd
- Timestamp fields: `start_time` / prefixed start_time
- Value fields: `heart_rate`, `max`, `min`, JSON `heart_rate`
- Unit conversion needed: None for bpm; HRV is separate milliseconds-like variability metrics
- Confidence rules: High when value and timestamp exist; medium for JSON-only sidecars
- Error handling: Skip impossible bpm <=0; warn for outliers, keep but flag extreme values.

Category: Steps
- Detection logic: match filename and header patterns.
- Filename patterns: `*pedometer*`, `*step_daily_trend*`, `*activity.day_summary*`, `*movement*`
- Header patterns: `step_count`, `count`, `walk_step_count`, `run_step_count`, `day_time`
- Required fields: date/day and step count
- Optional fields: distance, calorie, active_time, binning_data
- Timestamp fields: `day_time` for daily, `start_time` for intervals
- Value fields: `step_count`, `count`
- Unit conversion needed: Distance meters, active duration ms to seconds
- Confidence rules: High for daily summaries; medium for interval step_count rows
- Error handling: Deduplicate by source file + datauuid or timestamp interval.

Category: Sleep
- Detection logic: match filename and header patterns.
- Filename patterns: `*sleep*.csv`, `*sleep_stage*.csv`, `*vitality.nap_data*`
- Header patterns: `sleep_duration`, `sleep_score`, `stage`, prefixed sleep start/end
- Required fields: start and end times for sessions or stages
- Optional fields: score factors, stage rows, raw data sidecars
- Timestamp fields: `start_time`, `end_time`, prefixed sleep start/end
- Value fields: `sleep_score`, `stage`, durations
- Unit conversion needed: Normalize duration to seconds; map stage numeric codes to labels after verifying Samsung enum
- Confidence rules: High for sessions/stages; medium for raw_data
- Error handling: Join stages by `sleep_id`/session id; warn when stages exist without session.

Category: Exercise/workouts
- Detection logic: match filename and header patterns.
- Filename patterns: `*exercise*.csv`
- Header patterns: prefixed `com.samsung.health.exercise.*`, `exercise_type`, `duration`
- Required fields: start/end or duration
- Optional fields: distance, calorie, heart rate fields, live_data JSON
- Timestamp fields: prefixed exercise start/end
- Value fields: duration, calorie, distance, mean/max/min HR
- Unit conversion needed: Duration ms to seconds, distance meters, calories kcal
- Confidence rules: High for main exercise CSV
- Error handling: Do not parse route/location by default; mask location and require opt-in.

Category: Stress/recovery
- Detection logic: match filename and header patterns.
- Filename patterns: `*stress*.csv`, `*breathing*.csv`, `*mindfulness*`, `*mood*`, `*vitality_score*`
- Header patterns: `score`, `mood_type`, breathing `duration`, vitality scores
- Required fields: timestamp
- Optional fields: histogram sidecars, notes/factors if present
- Timestamp fields: `start_time`, `day_time`, `update_time`
- Value fields: `score`, `duration`, `total_score`
- Unit conversion needed: Duration ms to seconds; leave Samsung scores raw
- Confidence rules: Medium due sparse rows and proprietary scoring
- Error handling: Avoid medical language; treat as wellness/recovery signals only.

Category: Blood oxygen / SpO2
- Detection logic: match filename and header patterns.
- Filename patterns: `*oxygen_saturation*.csv`
- Header patterns: `spo2`, `min`, `max`, `low_duration`, `binning`
- Required fields: start time and spo2
- Optional fields: low_duration, coverage_rate, raw sidecars
- Timestamp fields: prefixed oxygen start/end
- Value fields: `spo2`, `min`, `max`
- Unit conversion needed: Percent; low_duration likely seconds, verify with ranges
- Confidence rules: High for summary rows; medium for raw waveform sidecars
- Error handling: Flag values outside 50-100 as invalid; keep low coverage warnings.

Category: Body metrics
- Detection logic: match filename and header patterns.
- Filename patterns: `*weight*.csv`, `*height*.csv`
- Header patterns: `weight`, `height`, `body_fat`, `skeletal_muscle_mass`
- Required fields: timestamp and metric value
- Optional fields: BMR, water, VFA
- Timestamp fields: `start_time`
- Value fields: weight/body composition columns
- Unit conversion needed: kg, cm, percent
- Confidence rules: High
- Error handling: Keep manual entries separate from device-derived composition where source differs.

Category: Nutrition/food
- Detection logic: match filename and header patterns.
- Filename patterns: `*nutrition*`, `*food_intake*`, `*food_info*`, `*food_image*`
- Header patterns: `calorie`, macro/micronutrient columns, `meal_type`
- Required fields: timestamp and calories/macros for entries
- Optional fields: food info lookup, image reference
- Timestamp fields: `start_time`
- Value fields: calorie, carbohydrate, protein, total_fat
- Unit conversion needed: kcal; macros grams; micronutrients as raw Samsung units
- Confidence rules: Medium due sparse and manual data
- Error handling: Do not render meal photos or food names unless user consents.

Category: Water intake
- Detection logic: match filename and header patterns.
- Filename patterns: `*water_intake*.csv`
- Header patterns: `amount`, `unit_amount`
- Required fields: timestamp and amount
- Optional fields: comment
- Timestamp fields: `start_time`
- Value fields: `amount`
- Unit conversion needed: Assume ml; verify against user_profile/preferences
- Confidence rules: Medium due only two rows
- Error handling: Warn if unit ambiguous.

Category: Device/source metadata
- Detection logic: match filename and header patterns.
- Filename patterns: `*device_profile*`, `*user_profile*`, `*hsp.references*`
- Header patterns: device/model/unit/source fields
- Required fields: none required
- Optional fields: units and source attribution
- Timestamp fields: update/create time
- Value fields: profile key-values
- Unit conversion needed: No health unit conversion except preferences
- Confidence rules: Medium
- Error handling: Always mask identifiers before logs/reports.

# 9. Data Quality Report

| Issue | Severity | Affected File(s) | Explanation | Recommended Fix |
|------|----------|------------------|-------------|-----------------|
| CSV metadata line before headers | Medium | All CSV files | A normal CSV parser will read the table metadata line as the header unless configured to skip it. | Skip first line; validate table name/schema version from it. |
| JSON sidecar dependency | Medium | Heart rate, steps, sleep raw, movement, SpO2, HRV, exercise | Many detailed samples are stored in JSON files referenced by UUID filename columns. | Resolve sidecars relative to `jsons/<table>/<first hex>/<filename>` with fallback recursive lookup. |
| Sparse water data | Low | water_intake | Only 2 rows were found. | Show section as limited and avoid trend claims. |
| Sparse nutrition data | Medium | nutrition, food_intake, food_info | Only tens of manual rows; meal images are private and not needed for MVP. | Support manually logged meals but mark nutrition insights as limited. |
| Sparse stress manual samples | Low | stress, breathing, mindfulness, mood | Stress score rows are few; vitality score has more but is proprietary. | Use as optional recovery signals only. |
| Missing clinical categories | Medium | blood pressure, ECG, menstrual cycle | No matching files found. | Implement absent-category UI and import warnings. |
| Timezone ambiguity | High | All timestamped files | CSV local strings and JSON epoch milliseconds are mixed; daily fields may use calendar-day semantics. | Normalize with `time_offset`; preserve local date separately. |
| Location privacy risk | High | exercise.weather and exercise route JSON | Weather file has lat/long and exercise JSON may have route coordinates. | Exclude route/location by default and mask in reports. |
| Large JSON groups | Medium | exercise, oxygen_saturation.raw, movement, pedometer_day_summary | Some JSON groups are multi-MiB and numerous. | Stream parse, cap files/size, and build progress UI. |
| Missing days in daily summaries | Low | pedometer daily summaries, sleep, vitality | Pedometer daily summary has 2 missing days in-range; sleep has more gaps. | Generate data-quality overlays on charts. |
| No exact duplicate CSV rows | Low | All parsed CSV files | Exact duplicate row count was 0 in all top-level CSVs. | Still dedupe by stable keys during import. |

# 10. Dashboard Feasibility

| Section | Feasibility | Reason |
|---|---|---|
| Overview dashboard | Ready | Steps, sleep, HR, SpO2, workouts, calories/body metrics exist. |
| Heart rate insights | Ready | 11,580 summary rows plus 2,086 JSON binned files. |
| Sleep insights | Ready | 392 sleep rows and 27,703 sleep-stage rows. |
| Steps/activity insights | Ready | Daily and interval steps plus movement and floors. |
| Workout insights | Ready | 586 workout sessions plus live-data sidecars. |
| Stress/recovery insights | Partially ready | Stress/mood/breathing sparse; vitality exists but proprietary. |
| Body metrics | Ready | Weight, height, body composition rows exist but count is small. |
| Nutrition/water | Partially ready | Manual nutrition rows and 2 water entries only. |
| Doctor report | Ready | Can summarize trends and data quality without diagnosis. |
| Symptom overlay | Not enough data | No symptom log was detected; app must collect it separately. |

# 11. Insight Opportunities

- Average daily steps and active-time trend.
- Walking/running step split and distance trend.
- Resting/typical heart-rate trend using personal baseline bands.
- High/low heart-rate days that are unusual compared with baseline.
- Sleep duration, sleep score, efficiency, and stage mix trend.
- Sleep vs next-day heart-rate and activity comparison.
- Workout frequency, duration, distance, calories, and heart-rate load trend.
- SpO2 nightly or session trend with low-coverage warnings.
- Body weight and body-composition trend.
- Activity consistency and missing-data warnings.
- Recovery/vitality trend as a Samsung-derived wellness signal.
- Nutrition/water summary with clear data-is-limited messaging.

Use non-medical wording such as "unusual compared with baseline", "worth discussing with a doctor", and "data is limited". Do not present diagnosis, disease claims, or emergency guidance from this export.

# 12. Doctor Report Recommendations

A doctor-friendly report should include the covered date range, data sources/devices with identifiers masked, heart-rate charts, sleep charts, steps/activity charts, workout charts, SpO2 summaries, body metric trends, symptom-log overlay if the future app collects symptoms, data quality warnings, and a user notes section. Include a disclaimer that the report is user-exported wellness data, may be incomplete, and is not a diagnosis.

# 13. Security and Privacy Recommendations

- Local-first browser parsing; no raw upload by default.
- Explicit consent before storing parsed data in IndexedDB.
- ZIP size limit and uncompressed-size limit.
- ZIP bomb protection using entry count, compression ratio, path traversal checks, and streaming limits.
- File count limit with user-visible warning for very large exports.
- Allowed extensions: `.csv`, `.json`, `.jpg` only if image support is explicitly enabled; ignore executables and HTML.
- Filename sanitization and normalized virtual paths; reject `../` and absolute paths.
- No raw HTML rendering from CSV/JSON fields.
- Delete/reset data button that clears IndexedDB, object URLs, and in-memory parser state.
- Never commit real export files; add export patterns to `.gitignore`.
- Use anonymized fixtures for tests and screenshots.
- Mask account IDs, device IDs, UUIDs, locations, names, emails, comments, and meal images in logs/reports.

# 14. Test Fixture Plan

Create an anonymized fixture by copying the folder structure and representative files, then replacing all data rows with synthetic rows that preserve headers, data types, date formats, row shapes, JSON sidecar references, and common null patterns. Keep the Samsung metadata line and schema versions because parser logic depends on them. Preserve UUID-like filename shape but replace values with deterministic fake IDs.

Remove or fake names, account IDs, device IDs, package/source identifiers if they could identify the user, location coordinates, comments, notes, food images, profile image, exact timestamps if considered sensitive, and any unique personal metadata. Keep enough rows per category to test ranges, missing values, sidecar joins, duplicate handling, invalid numeric handling, and timezone conversion.

# 15. Final Build Recommendations

Use a two-phase parser: first inventory and classify files, then parse selected categories with schema-specific mappers. Keep raw rows out of application state after normalization where possible. Store normalized records plus parser warnings, source file references, and source timezone metadata.

Dashboard MVP should focus on overview, daily steps/activity, heart rate, sleep, workouts, SpO2, body metrics, and data-quality warnings. Nutrition, water, stress/recovery, route maps, meal images, blood pressure, ECG, and menstrual cycle should be optional or future work for this export. Doctor report generation should use normalized summaries, charts, masked source metadata, user notes, symptom overlays collected by the app, and a clear non-diagnostic disclaimer.

Risks to handle first: CSV metadata-line parsing, timezone/local-day correctness, sidecar JSON joins, location/privacy masking, large ZIP limits, and absent-category handling.

- [ ] Can parse ZIP
- [ ] Can detect categories
- [ ] Can normalize major health files
- [ ] Can generate charts
- [ ] Can generate doctor report
- [ ] Can handle unknown files
- [ ] Can protect privacy
