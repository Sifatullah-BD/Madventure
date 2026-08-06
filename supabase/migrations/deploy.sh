#!/usr/bin/env bash
# supabase/migrations/deploy.sh
# This script runs Supabase database migrations and reloads edge functions.
# Ensure you have the Supabase CLI installed and your SUPABASE_ACCESS_TOKEN set.

set -e

echo "Running Supabase database migrations..."
supabase db push

echo "Reloading Supabase Edge Functions..."
supabase functions reload

echo "Supabase deployment completed."
