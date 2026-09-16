-- Phase 4: Database Architecture

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_code VARCHAR(20) UNIQUE NOT NULL,
    college_name TEXT NOT NULL,
    participant_1 TEXT NOT NULL,
    participant_2 TEXT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    phone_number_2 VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    access_code_hash TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    failed_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_verification TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number INT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    theme TEXT NOT NULL,
    facts TEXT,
    plaintiff TEXT NOT NULL,
    defendant TEXT NOT NULL,
    issues TEXT,
    pdf_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id),
    team_a UUID REFERENCES teams(id),
    team_b UUID REFERENCES teams(id),
    round INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    side VARCHAR(20) NOT NULL, -- 'PLAINTIFF' or 'DEFENDANT'
    court_number INT NOT NULL,
    allotted_time VARCHAR(50),
    match_id UUID REFERENCES matches(id),
    round INT DEFAULT 1,
    locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id)
);

CREATE TABLE event_settings (
    id INT PRIMARY KEY DEFAULT 1,
    release_time TIMESTAMPTZ NOT NULL,
    draw_locked BOOLEAN DEFAULT FALSE,
    results_published BOOLEAN DEFAULT FALSE,
    event_status VARCHAR(20) DEFAULT 'PREPARATION'
);

CREATE TABLE reveal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id),
    verified_at TIMESTAMPTZ,
    revealed_at TIMESTAMPTZ,
    last_activity TIMESTAMPTZ
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID,
    action TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

CREATE TABLE results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    best_plaintiff_team UUID REFERENCES teams(id),
    best_defendant_team UUID REFERENCES teams(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE judges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    court_number INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id),
    team_id UUID REFERENCES teams(id),
    judge_id UUID REFERENCES judges(id),
    round INT NOT NULL,
    score DECIMAL(5,2),
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Setup (Security)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to event_settings (e.g. for release_time)
CREATE POLICY "Allow public read of event_settings" ON event_settings FOR SELECT USING (true);
