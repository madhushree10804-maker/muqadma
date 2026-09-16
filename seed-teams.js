import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const teamsData = [
  {
    college_name: 'School of Social Work, Roshni Nilaya',
    participant_1: 'Bonita Wilma Rodrigues',
    phone_number: '+918147242301',
    participant_2: 'MG Raha mariyam',
    phone_number_2: '+919535423901'
  },
  {
    college_name: 'Institute of Aviation Studies, Srinivas University',
    participant_1: 'Varsha',
    phone_number: '+918792086107',
    participant_2: 'Sinchana S Bhat',
    phone_number_2: '+919108455048'
  },
  {
    college_name: 'Yenepoya School Of Allied Health Sciences, Yenepoya University, Mangalore.',
    participant_1: 'Aliya Zainab',
    phone_number: '+971566595918',
    participant_2: 'Shaima Saleem',
    phone_number_2: '+918123902326'
  },
  {
    college_name: 'Yenepoya Institute of Arts, Science, Commerce and Management',
    participant_1: 'Zahan Zabith',
    phone_number: '+919633851277',
    participant_2: 'Mathew Venu',
    phone_number_2: '+917034984703'
  },
  {
    college_name: 'Carmel College of Arts, Science and Commerce for Women, Nuvem Goa',
    participant_1: 'Tamanna',
    phone_number: '+918446352582',
    participant_2: 'Ulfat Banoo Sunkad',
    phone_number_2: '+918793857887'
  },
  {
    college_name: 'SDM LAW COLLEGE',
    participant_1: 'Sammedh',
    phone_number: '+916362243780',
    participant_2: 'Bhaavana',
    phone_number_2: '+916360303114'
  },
  {
    college_name: 'SDM COLLEGE OF BUSINESS MANAGEMENT',
    participant_1: 'Abhishek',
    phone_number: '+919035745658',
    participant_2: 'Laxmisagar',
    phone_number_2: '+919113595649'
  },
  {
    college_name: 'St Aloysius (Deemed to be University)',
    participant_1: 'Jahanara azmi',
    phone_number: '+919400777422',
    participant_2: 'Diksha',
    phone_number_2: '+919663510286'
  },
  {
    college_name: 'Canara College autonomous Mangalore',
    participant_1: 'Samith',
    phone_number: '+918050037506',
    participant_2: 'Soumya',
    phone_number_2: '+916361364276'
  },
  {
    college_name: 'Nitte institute of communication',
    participant_1: 'Pragna',
    phone_number: '+919663347913',
    participant_2: 'Reva',
    phone_number_2: ''
  },
  {
    college_name: 'BESANT WOMEN\'S COLLEGE',
    participant_1: 'Sidra',
    phone_number: '+918762816088',
    participant_2: 'Sana',
    phone_number_2: '+918217537631'
  }
];

async function seedTeams() {
  console.log("Starting team injection...");
  for (let i = 0; i < teamsData.length; i++) {
    const t = teamsData[i];
    // Generate Team Code, e.g. T01, T02
    const team_code = `T${String(i + 1).padStart(2, '0')}`;
    
    const { data, error } = await supabase.from('teams').insert({
      team_code,
      college_name: t.college_name,
      participant_1: t.participant_1,
      participant_2: t.participant_2,
      phone_number: t.phone_number,
      phone_number_2: t.phone_number_2,
      status: 'ACTIVE'
    });

    if (error) {
      console.error(`Error inserting ${team_code}:`, error.message);
    } else {
      console.log(`Successfully inserted ${team_code} - ${t.college_name}`);
    }
  }
  console.log("Done inserting teams.");
}

seedTeams();
