#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
source_dir="$project_dir/images"
output_dir="$source_dir/optimized"
mkdir -p "$output_dir"

convert "$source_dir/logo-circle.png" -auto-orient -strip -resize '96x96>' \
    -quality 100 -define webp:lossless=true -define webp:method=6 \
    "$output_dir/logo-circle-96.webp"
convert "$source_dir/logo-circle.png" -auto-orient -strip -resize '192x192>' \
    -quality 100 -define webp:lossless=true -define webp:method=6 \
    "$output_dir/logo-circle-192.webp"

for source_path in "$source_dir"/pc*.png; do
    image_name="$(basename "$source_path" .png)"
    convert "$source_path" -auto-orient -strip -resize '480x480>' \
        -define webp:lossless=true -define webp:method=6 \
        "$output_dir/${image_name}-480.webp"
    convert "$source_path" -auto-orient -strip -resize '960x960>' \
        -define webp:lossless=true -define webp:method=6 \
        "$output_dir/${image_name}-960.webp"
done

for source_path in "$source_dir"/about*.jpg "$source_dir"/review_*.jpg; do
    image_name="$(basename "$source_path" .jpg)"
    convert "$source_path" -auto-orient -strip -resize '480x480>' \
        -quality 92 -define webp:method=6 \
        "$output_dir/${image_name}-480.webp"
    convert "$source_path" -auto-orient -strip -resize '960x960>' \
        -quality 92 -define webp:method=6 \
        "$output_dir/${image_name}-960.webp"
done

for source_path in "$source_dir"/work*.jpg; do
    image_name="$(basename "$source_path" .jpg)"
    convert "$source_path" -auto-orient -strip -resize '960x960>' \
        -quality 92 -define webp:method=6 \
        "$output_dir/${image_name}-960.webp"
    convert "$source_path" -auto-orient -strip -resize '1600x1600>' \
        -quality 92 -define webp:method=6 \
        "$output_dir/${image_name}-1600.webp"
done

echo "Optimized images written to $output_dir"
