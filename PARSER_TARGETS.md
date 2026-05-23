# HealthLens Parser Targets

## Samsung CSV Contract

All Samsung CSV files in the MVP report follow this pattern:

- Line 1: Samsung metadata, usually table name, app/schema version, and schema count.
- Line 2: real CSV header.
- Line 3 onward: data rows.

Parser requirements:
- Preserve `tableName`, `schemaVersion`, and metadata tokens from line 1.
- Normalize headers to lowercase snake case by trimming and converting spaces, dots, and hyphens to underscores.
- Convert empty strings to `null`.
- Convert numeric strings safely where category mappers expect numbers.
- Continue import when one file fails and emit `ParserWarning`.

## Primary Files

Heart rate:
- `com.samsung.shealth.tracker.heart_rate.*.csv`
- `com.samsung.health.hrv.*.csv`
- `com.samsung.shealth.exercise.recovery_heart_rate.*.csv`
- `jsons/com.samsung.shealth.tracker.heart_rate/**`

Activity:
- `com.samsung.shealth.activity.day_summary.*.csv`
- `com.samsung.shealth.step_daily_trend.*.csv`
- `com.samsung.shealth.tracker.pedometer_day_summary.*.csv`
- `com.samsung.shealth.tracker.pedometer_step_count.*.csv`
- `com.samsung.health.movement.*.csv`
- `com.samsung.health.floors_climbed.*.csv`

Sleep:
- `com.samsung.shealth.sleep.*.csv`
- `com.samsung.shealth.sleep_combined.*.csv`
- `com.samsung.health.sleep_stage.*.csv`
- `com.samsung.shealth.sleep_raw_data.*.csv`
- `com.samsung.shealth.vitality.nap_data.*.csv`

Workouts:
- `com.samsung.shealth.exercise.*.csv`
- `com.samsung.shealth.exercise.extension.*.csv`
- `com.samsung.shealth.exercise.recovery_heart_rate.*.csv`
- `com.samsung.shealth.exercise.weather.*.csv`
- `jsons/com.samsung.shealth.exercise/**`

SpO2:
- `com.samsung.shealth.tracker.oxygen_saturation.*.csv`
- `com.samsung.health.oxygen_saturation.raw.*.csv`
- related JSON sidecars

Body:
- `com.samsung.health.weight.*.csv`
- `com.samsung.health.height.*.csv`

Nutrition:
- `com.samsung.health.nutrition.*.csv`
- `com.samsung.health.food_intake.*.csv`
- `com.samsung.health.food_info.*.csv`
- `com.samsung.shealth.food_image.*.csv` is inventory-only; do not render images in MVP.

Water:
- `com.samsung.health.water_intake.*.csv`

Stress/recovery:
- `com.samsung.shealth.stress.*.csv`
- `com.samsung.shealth.stress.histogram.*.csv`
- `com.samsung.shealth.vitality_score.*.csv`
- `com.samsung.shealth.breathing.*.csv`
- `com.samsung.shealth.mood.*.csv`

Metadata:
- `com.samsung.health.device_profile.*.csv`
- `com.samsung.health.user_profile.*.csv`
- `com.samsung.shealth.hsp.references.*.csv`

## Sidecar Resolution

When a CSV value references `raw_data`, `binning_data`, `live_data`, `extra_data`, `heart_rate`, `data`, `source_info`, or `achievement`:

1. Try `jsons/<table>/<first hex char>/<filename>`.
2. Fall back to a filename index built during inventory.
3. Parse sidecars only when requested by a category parser.
4. Never fail the full import because a sidecar is missing.

## Detection Categories

Show status for:
- Heart rate
- Steps/activity
- Sleep
- Exercise/workouts
- Blood oxygen / SpO2
- Body metrics
- Calories/activity
- Nutrition
- Water
- Stress/recovery
- Blood pressure
- ECG
- Menstrual cycle
- Device/source metadata
- Unknown/unsupported

