-- Seed data for Step 2 features

-- 1. Cancellation Policies
INSERT INTO public.cancellation_policies (name, description, refund_percentage, deadline_days, is_default)
VALUES 
('Flexible', '100% refund up to 72 hours before departure.', 100, 3, true),
('Moderate', '50% refund up to 7 days before departure.', 50, 7, false),
('Strict', 'Non-refundable.', 0, 0, false)
ON CONFLICT DO NOTHING;

-- 2. Coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_purchase, expiry_date, usage_limit)
VALUES 
('SAVE10', '10% discount on all tours', 'percentage', 10, 1000, '2026-12-31 23:59:59', 1000),
('WELCOME500', 'Fixed ৳500 discount for new users', 'fixed', 500, 5000, '2026-12-31 23:59:59', 500),
('EID2025', 'Special Eid discount 15%', 'percentage', 15, 2000, '2025-06-30 23:59:59', 2000)
ON CONFLICT (code) DO NOTHING;

-- 3. Transports (Initial set for searching)
INSERT INTO public.transports (provider_name, transport_type, route_from, route_to, departure_time, price, total_seats, available_seats)
VALUES 
('Hanif Enterprise', 'BUS', 'Dhaka', 'Chittagong', '22:00:00', 1200, 40, 40),
('Ena Transport', 'BUS', 'Dhaka', 'Sylhet', '08:30:00', 800, 36, 36),
('Green Line', 'BUS', 'Dhaka', 'Cox''s Bazar', '23:00:00', 2500, 30, 30),
('Parabat Express', 'TRAIN', 'Dhaka', 'Sylhet', '06:40:00', 650, 500, 500),
('Green Line Waterways', 'LAUNCH', 'Dhaka', 'Barishal', '21:00:00', 1500, 200, 200)
ON CONFLICT DO NOTHING;
