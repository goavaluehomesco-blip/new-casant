-- Seed initial data for Casant Events

-- Insert company info
INSERT INTO company_info (name, tagline, about_short, about_full, years_experience, clients_count, projects_count, hotels_count, email, phone, address)
VALUES (
  'Casant Events',
  'Creating Unforgettable Moments',
  'With over 25 years of experience, Casant Events is your trusted partner for weddings, corporate events, and complete event production solutions.',
  'Casant Events has been at the forefront of the event management industry for over two decades. Our commitment to excellence, attention to detail, and passion for creating unforgettable experiences has made us the preferred choice for discerning clients across the region. We own all our equipment in-house, ensuring complete control over quality and availability.',
  25,
  1000,
  1000,
  100,
  'info@casantevents.com',
  '+91 98765 43210',
  'Mumbai, Maharashtra, India'
);

-- Insert default services
INSERT INTO services (title, description, icon, link, display_order) VALUES
('Weddings', 'Transform your special day into an unforgettable celebration with our expert wedding planning and execution services.', 'heart', '/weddings', 1),
('Corporate Events', 'From conferences to product launches, we deliver professional corporate events that make an impact.', 'building', '/corporate', 2),
('Lighting', 'State-of-the-art lighting solutions to create the perfect ambiance for any event.', 'lightbulb', '/inventory?tab=lights', 3),
('Sound', 'Crystal-clear audio systems for events of any scale, from intimate gatherings to large concerts.', 'speaker', '/inventory?tab=sound', 4),
('Production', 'Complete event production including staging, LED walls, and special effects.', 'video', '/inventory?tab=production', 5);

-- Insert gallery categories
INSERT INTO gallery_categories (name, slug, description, display_order) VALUES
('Weddings', 'weddings', 'Beautiful wedding celebrations we have had the honor of creating', 1),
('Corporate Events', 'corporate', 'Professional corporate events and conferences', 2);

-- Insert inventory categories
INSERT INTO inventory_categories (name, slug, description, icon, display_order) VALUES
('Lights', 'lights', 'Professional stage and event lighting equipment', 'lightbulb', 1),
('Sound', 'sound', 'High-quality audio and sound systems', 'speaker', 2),
('Production', 'production', 'Staging, LED walls, and production equipment', 'video', 3);

-- Insert sample team members (directors)
INSERT INTO team_members (name, role, bio, display_order) VALUES
('Rajesh Sharma', 'Founder & CEO', 'With over 30 years of experience in the events industry, Rajesh founded Casant Events with a vision to create world-class experiences. His passion for perfection and innovative approach has made Casant Events a leading name in the industry.', 1),
('Priya Patel', 'Creative Director', 'Priya brings artistic vision and creative excellence to every event. Her background in design and 15+ years in event management ensures each celebration is uniquely beautiful and memorable.', 2),
('Amit Kumar', 'Technical Director', 'Amit oversees all technical operations including lighting, sound, and production. His expertise ensures flawless execution and cutting-edge technology integration in all our events.', 3);

-- Insert sample inventory items for Lights
INSERT INTO inventory_items (category_id, name, description, specifications, display_order) 
SELECT id, 'LED Par Lights', 'High-output LED par cans for vibrant stage lighting', '["18x18W RGBWA+UV", "DMX512 Control", "Silent Operation", "IP65 Rated"]', 1
FROM inventory_categories WHERE slug = 'lights';

INSERT INTO inventory_items (category_id, name, description, specifications, display_order)
SELECT id, 'Moving Head Spots', 'Professional moving head fixtures for dynamic lighting effects', '["350W LED Source", "Pan/Tilt Movement", "Gobo Wheels", "Color Mixing"]', 2
FROM inventory_categories WHERE slug = 'lights';

INSERT INTO inventory_items (category_id, name, description, specifications, display_order)
SELECT id, 'LED Wall Washers', 'Linear LED fixtures for architectural and stage washing', '["48x3W LEDs", "Wide Beam Angle", "DMX Control", "IP65 Outdoor Rated"]', 3
FROM inventory_categories WHERE slug = 'lights';

INSERT INTO inventory_items (category_id, name, description, specifications, display_order)
SELECT id, 'Follow Spots', 'Professional follow spot lights for highlighting performers', '["1200W HMI", "Manual Operation", "Iris & Dimmer", "Color Changers"]', 4
FROM inventory_categories WHERE slug = 'lights';

-- Insert sample inventory items for Sound
INSERT INTO inventory_items (category_id, name, description, specifications, display_order)
SELECT id, 'Line Array Systems', 'Professional line array speakers for large events', '["JBL VTX Series", "Up to 145dB SPL", "Scalable Coverage", "Rigging Hardware"]', 1
FROM inventory_categories WHERE slug = 'sound';

INSERT INTO inventory_items (category_id, name, description, specifications, display_order)
SELECT id, 'Subwoofers', 'High-power subwoofers for deep bass response', '["Dual 18\" Drivers", "2000W Power", "Cardioid Option", "Touring Grade"]', 2
FROM inventory_categories WHERE slug = 'sound';

INSERT INTO inventory_items (category_id, name, description, specifications, display_order)
SELECT id, 'Digital Mixing Consoles', 'State-of-the-art digital mixing systems', '["96 Input Channels", "Built-in Effects", "Dante Networking", "Touchscreen Control"]', 3
FROM inventory_categories WHERE slug = 'sound';

INSERT INTO inventory_items (category_id, name, description, specifications, display_order)
SELECT id, 'Wireless Microphones', 'Professional wireless microphone systems', '["Digital Transmission", "100m Range", "Auto Frequency Scan", "Rechargeable"]', 4
FROM inventory_categories WHERE slug = 'sound';

-- Insert sample inventory items for Production
INSERT INTO inventory_items (category_id, name, description, specifications, display_order)
SELECT id, 'LED Video Walls', 'High-resolution indoor and outdoor LED displays', '["P2.9 & P3.9 Pitch", "500x500mm Panels", "HDR Support", "Quick Assembly"]', 1
FROM inventory_categories WHERE slug = 'production';

INSERT INTO inventory_items (category_id, name, description, specifications, display_order)
SELECT id, 'Staging Systems', 'Modular staging platforms for any venue', '["1m x 2m Decks", "Adjustable Height", "750kg/m² Load", "Skirting Options"]', 2
FROM inventory_categories WHERE slug = 'production';

INSERT INTO inventory_items (category_id, name, description, specifications, display_order)
SELECT id, 'Truss Systems', 'Aluminum truss for lighting and rigging', '["Box & Triangle Truss", "Various Lengths", "Ground Support", "Motor Hoists"]', 3
FROM inventory_categories WHERE slug = 'production';

INSERT INTO inventory_items (category_id, name, description, specifications, display_order)
SELECT id, 'Special Effects', 'CO2 jets, confetti machines, and pyrotechnics', '["CO2 Cryo Jets", "Confetti Cannons", "Cold Spark Machines", "Haze & Fog"]', 4
FROM inventory_categories WHERE slug = 'production';
