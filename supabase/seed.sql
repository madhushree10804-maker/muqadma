-- Phase 5: Seed 11 Teams
INSERT INTO teams (team_code, college_name, participant_1, participant_2, phone_number, phone_number_2) VALUES
('MUQ-01', 'School of Social Work, Roshni Nilaya', 'Bonita Wilma Rodrigues', 'MG Raha Mariyam', '9999999901', '8888888801'),
('MUQ-02', 'Institute of Aviation Studies, Srinivas University', 'Varsha', 'Sinchana S Bhat', '9999999902', '8888888802'),
('MUQ-03', 'Yenepoya School of Allied Health Sciences, Mangalore', 'Aliya Zainab', 'Shaima Saleem', '9999999903', '8888888803'),
('MUQ-04', 'Yenepoya Institute of Arts, Science, Commerce and Management', 'Zahan Zabith', 'Mathew Venu', '9999999904', '8888888804'),
('MUQ-05', 'Carmel College of Arts, Science and Commerce for Women, Nuvem Goa', 'Tamanna', 'Ulfat Banoo Sunkad', '9999999905', '8888888805'),
('MUQ-06', 'SDM Law College', 'Sammedh', 'Bhaavana', '9999999906', '8888888806'),
('MUQ-07', 'SDM College of Business Management', 'Abhishek', 'Laxmisagar', '9999999907', '8888888807'),
('MUQ-08', 'St. Aloysius (Deemed to be University)', 'Jahanara Azmi', 'Diksha', '9999999908', '8888888808'),
('MUQ-09', 'Canara College Autonomous, Mangalore', 'Samith', 'Soumya', '9999999909', '8888888809'),
('MUQ-10', 'Nitte Institute of Communication', 'Pragna', 'Reva', '9999999910', '8888888810'),
('MUQ-11', 'Besant Women''s College', 'Sidra', 'Sana', '9999999911', '8888888811');

-- Add dummy access codes for testing (using simple SHA256 hashes of "123456" for all teams for dev purposes)
-- In production, the admin will generate and give random codes.
INSERT INTO team_access (team_id, access_code_hash)
SELECT id, '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' FROM teams;


-- Phase 6: Seed 6 Cases
INSERT INTO cases (case_number, title, theme, plaintiff, defendant, issues) VALUES
(1, 'Asha v. St. Agnes College Management', 'CCTV, Privacy and Student Safety', 'Asha', 'St. Agnes College Management', '1. Whether CCTV installation violates Right to Privacy.
2. Whether security concerns justify surveillance.
3. Whether adequate privacy measures were taken.
4. Whether a less intrusive arrangement could have been adopted.'),

(2, 'Rahul v. ABC College', 'Social Media, Free Speech and College Discipline', 'Rahul', 'College Management', '1. Whether the social-media post is protected speech.
2. Whether a college can punish political opinions on a personal account.
3. Whether actual institutional harm occurred.
4. Whether disciplinary action was proportionate.'),

(3, 'Priya v. State Government Department', 'Woman Rejected for Government Employment', 'Priya', 'State Government Department', '1. Gender discrimination.
2. Constitutional equality.
3. Equality of opportunity in public employment.
4. Judicial interference in selection.'),

(4, 'Residents of Green Nagar v. Green Chemicals Pvt. Ltd.', 'Factory Pollution and Right to Development', 'Residents / Environmental Group', 'Green Chemicals Pvt. Ltd.', '1. Environmental law violations.
2. Article 21 and clean environment.
3. Development versus environmental damage.
4. Compensation.
5. Closure or safeguards.'),

(5, 'Sri Dharma Seva Sangha v. District Administration', 'Religious Procession versus Public Order', 'Sri Dharma Seva Sangha', 'District Administration', '1. Articles 25 and 26.
2. State regulation.
3. Public order.
4. Public safety.
5. Alternative route.'),

(6, 'Creative Events Pvt. Ltd. v. St. Agnes College', 'College Fest Contract and Cancellation', 'Creative Events Pvt. Ltd.', 'College Management', '1. Breach of contract.
2. Cancellation clause.
3. Advance retention.
4. Recovery of expenses.
5. Prospective losses.');

-- Default Settings (Wednesday 9:00 AM logic)
INSERT INTO event_settings (id, release_time, draw_locked, results_published) 
VALUES (1, '2026-09-16 09:00:00+05:30', false, false);
