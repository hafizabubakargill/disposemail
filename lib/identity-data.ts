// ============================================================
// Identity Generator Data — All client-side, no API required
// ============================================================

export type CountryCode = 'US' | 'UK' | 'CA' | 'AU' | 'DE' | 'FR' | 'PK' | 'IN';

export interface CountryData {
  name: string;
  flag: string;
  phonePrefix: string;
  phoneFormat: string; // # = digit
  postalFormat: string; // # = digit, A = letter
  states: string[];
  cities: string[];
  streetTypes: string[];
  female: string[];
  male: string[];
  middle: string[];
  last: string[];
}

export const COUNTRIES: Record<CountryCode, CountryData> = {
  US: {
    name: 'United States', flag: '🇺🇸',
    phonePrefix: '+1', phoneFormat: '(###) ###-####',
    postalFormat: '#####',
    states: ['California','Texas','Florida','New York','Illinois','Pennsylvania','Ohio','Georgia','North Carolina','Michigan'],
    cities: ['Los Angeles','Houston','Chicago','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville','Fort Worth','Columbus','Charlotte','Indianapolis','Seattle','Denver','Nashville','Oklahoma City','El Paso'],
    streetTypes: ['Street','Avenue','Boulevard','Drive','Lane','Road','Court','Place','Way','Circle'],
    female: ['Emma','Olivia','Ava','Isabella','Sophia','Charlotte','Mia','Amelia','Harper','Evelyn','Abigail','Emily','Elizabeth','Mila','Ella','Luna','Sofia','Camila','Aria','Grace'],
    male: ['Liam','Noah','William','James','Oliver','Benjamin','Elijah','Lucas','Mason','Logan','Ethan','Aiden','Jackson','Sebastian','Carter','Owen','Daniel','Henry','Alexander','Jack'],
    middle: ['Marie','Grace','Ann','Louise','Rose','Jane','Mae','Elizabeth','Lynn','Lee','James','Michael','Robert','David','John','Thomas','Edward','Joseph','Charles','William'],
    last: ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin'],
  },
  UK: {
    name: 'United Kingdom', flag: '🇬🇧',
    phonePrefix: '+44', phoneFormat: '#### ### ####',
    postalFormat: 'AA## #AA',
    states: ['England','Scotland','Wales','Northern Ireland'],
    cities: ['London','Birmingham','Manchester','Leeds','Glasgow','Sheffield','Bradford','Liverpool','Edinburgh','Bristol','Cardiff','Leicester','Coventry','Nottingham','Newcastle','Sunderland','Brighton','Hull','Plymouth','Stoke-on-Trent'],
    streetTypes: ['Street','Road','Avenue','Lane','Close','Drive','Way','Court','Place','Grove'],
    female: ['Olivia','Amelia','Isla','Ava','Emily','Grace','Freya','Mia','Sophia','Charlotte','Poppy','Lily','Ella','Isabella','Evie','Rosie','Florence','Daisy','Sophie','Alice'],
    male: ['Oliver','George','Harry','Noah','Charlie','Jack','Leo','Freddie','Alfie','Arthur','Oscar','Albert','Archie','Henry','Theodore','Thomas','Liam','Ethan','William','Mason'],
    middle: ['James','William','Alexander','Edward','Thomas','Robert','John','George','Charles','Michael','Elizabeth','Mary','Ann','Rose','Jane','Louise','Grace','Catherine','Frances','Margaret'],
    last: ['Smith','Jones','Williams','Taylor','Brown','Davies','Evans','Wilson','Thomas','Roberts','Johnson','Walker','Wright','Thompson','Robinson','White','Hughes','Edwards','Green','Hall'],
  },
  CA: {
    name: 'Canada', flag: '🇨🇦',
    phonePrefix: '+1', phoneFormat: '(###) ###-####',
    postalFormat: 'A#A #A#',
    states: ['Ontario','Quebec','British Columbia','Alberta','Manitoba','Saskatchewan','Nova Scotia','New Brunswick','Newfoundland','Prince Edward Island'],
    cities: ['Toronto','Montreal','Vancouver','Calgary','Edmonton','Ottawa','Winnipeg','Quebec City','Hamilton','Brampton','Surrey','Laval','Halifax','London','Markham','Vaughan','Gatineau','Saskatoon','Longueuil','Burnaby'],
    streetTypes: ['Street','Avenue','Boulevard','Drive','Road','Court','Crescent','Way','Lane','Trail'],
    female: ['Emma','Olivia','Charlotte','Sophia','Ava','Isabella','Mia','Amelia','Harper','Evelyn','Abigail','Emily','Sofia','Camila','Aurora','Aria','Scarlett','Victoria','Madison','Luna'],
    male: ['Liam','Noah','William','James','Oliver','Benjamin','Lucas','Mason','Logan','Ethan','Aiden','Owen','Sebastian','Carter','Daniel','Henry','Alexander','Jack','Michael','Ryan'],
    middle: ['Marie','Grace','Louise','Rose','Ann','Elizabeth','Jane','Mae','Lynn','Nicole','James','Michael','Robert','David','John','Thomas','William','Joseph','Charles','Alexander'],
    last: ['Smith','Brown','Lee','Wilson','Campbell','Martin','Anderson','Thompson','Taylor','MacDonald','Johnson','White','Clark','Moore','Hill','Scott','Harris','Lewis','Walker','Young'],
  },
  AU: {
    name: 'Australia', flag: '🇦🇺',
    phonePrefix: '+61', phoneFormat: '#### ### ###',
    postalFormat: '####',
    states: ['New South Wales','Victoria','Queensland','Western Australia','South Australia','Tasmania','ACT','Northern Territory'],
    cities: ['Sydney','Melbourne','Brisbane','Perth','Adelaide','Gold Coast','Newcastle','Canberra','Hobart','Darwin','Geelong','Townsville','Wollongong','Logan City','Bendigo','Ballarat','Mackay','Toowoomba','Cairns','Launceston'],
    streetTypes: ['Street','Avenue','Road','Drive','Lane','Court','Place','Way','Circuit','Crescent'],
    female: ['Olivia','Charlotte','Amelia','Ava','Isla','Grace','Mia','Harper','Sophia','Lily','Zoe','Emily','Ella','Evie','Mila','Sophie','Chloe','Isabella','Ruby','Sienna'],
    male: ['Oliver','Noah','William','Jack','Leo','Lucas','Henry','Liam','Elijah','Charlie','Ethan','James','Thomas','Alexander','Lachlan','Logan','Sebastian','Xavier','Hudson','Archer'],
    middle: ['James','William','Elizabeth','Grace','Rose','Ann','Louise','Lee','Marie','Michael','John','Robert','Thomas','David','Alexander','Edward','Joseph','Charles','Catherine','Margaret'],
    last: ['Smith','Jones','Williams','Brown','Wilson','Taylor','Johnson','White','Martin','Anderson','Thompson','Thomas','Walker','Harris','Robinson','Jackson','Clarke','Hill','Scott','Mitchell'],
  },
  DE: {
    name: 'Germany', flag: '🇩🇪',
    phonePrefix: '+49', phoneFormat: '#### #######',
    postalFormat: '#####',
    states: ['Bavaria','North Rhine-Westphalia','Baden-Württemberg','Lower Saxony','Hesse','Saxony','Rhineland-Palatinate','Berlin','Thuringia','Brandenburg'],
    cities: ['Berlin','Hamburg','Munich','Cologne','Frankfurt','Stuttgart','Düsseldorf','Dortmund','Essen','Leipzig','Bremen','Dresden','Hannover','Nuremberg','Duisburg','Bochum','Wuppertal','Bielefeld','Bonn','Münster'],
    streetTypes: ['Straße','Gasse','Allee','Weg','Platz','Ring','Damm','Ufer','Chaussee','Pfad'],
    female: ['Emma','Mia','Hannah','Emilia','Sophia','Lina','Lea','Leonie','Marie','Clara','Laura','Lena','Luisa','Anna','Johanna','Lisa','Amelie','Katarina','Stefanie','Julia'],
    male: ['Noah','Leon','Lukas','Felix','Jonas','Paul','Finn','Elias','Benedikt','Luca','Tim','Jan','Niklas','Tobias','Max','Maximilian','Alexander','Julian','Florian','Moritz'],
    middle: ['Maria','Anna','Elisabeth','Sophie','Katharina','Christina','Johanna','Marie','Luisa','Lena','Hans','Karl','Wilhelm','Friedrich','Johann','Michael','Thomas','Stefan','Peter','Andreas'],
    last: ['Müller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Schulz','Hoffmann','Schäfer','Koch','Bauer','Richter','Klein','Wolf','Schröder','Neumann','Schwarz','Zimmermann'],
  },
  FR: {
    name: 'France', flag: '🇫🇷',
    phonePrefix: '+33', phoneFormat: '## ## ## ## ##',
    postalFormat: '#####',
    states: ['Île-de-France','Auvergne-Rhône-Alpes','Hauts-de-France','Nouvelle-Aquitaine','Occitanie','Grand Est','Provence-Alpes-Côte d\'Azur','Normandie','Bretagne','Pays de la Loire'],
    cities: ['Paris','Marseille','Lyon','Toulouse','Nice','Nantes','Montpellier','Strasbourg','Bordeaux','Lille','Rennes','Reims','Le Havre','Saint-Étienne','Toulon','Grenoble','Dijon','Angers','Nîmes','Villeurbanne'],
    streetTypes: ['Rue','Avenue','Boulevard','Allée','Passage','Impasse','Chemin','Route','Place','Voie'],
    female: ['Emma','Manon','Chloé','Louise','Léa','Jade','Alice','Camille','Lucie','Inès','Zoé','Océane','Sarah','Eva','Marine','Laura','Mathilde','Victoria','Sophie','Charlotte'],
    male: ['Gabriel','Raphaël','Arthur','Louis','Lucas','Hugo','Théo','Nathan','Thomas','Léo','Maxime','Baptiste','Romain','Pierre','Nicolas','Julien','Antoine','Clément','Quentin','Alexandre'],
    middle: ['Marie','Anne','Claire','Sophie','Christine','Isabelle','Catherine','Hélène','Michèle','Françoise','Jean','Michel','Pierre','André','Henri','Jacques','Alain','Bernard','François','Philippe'],
    last: ['Martin','Bernard','Thomas','Petit','Robert','Richard','Durand','Dubois','Moreau','Laurent','Simon','Michel','Lefebvre','Leroy','Roux','David','Bertrand','Morel','Fournier','Girard'],
  },
  PK: {
    name: 'Pakistan', flag: '🇵🇰',
    phonePrefix: '+92', phoneFormat: '### #######',
    postalFormat: '#####',
    states: ['Punjab','Sindh','Khyber Pakhtunkhwa','Balochistan','Islamabad Capital Territory'],
    cities: ['Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Hyderabad','Peshawar','Quetta','Gujranwala','Sialkot','Bahawalpur','Sargodha','Sukkur','Larkana','Sheikhupura','Rahim Yar Khan','Mardan','Gujrat','Kasur'],
    streetTypes: ['Street','Road','Avenue','Lane','Colony','Block','Sector','Phase','Town','Market'],
    female: ['Ayesha','Fatima','Zainab','Mariam','Sana','Hira','Rabia','Amna','Sara','Noor','Khadija','Asma','Nimra','Madiha','Aroha','Saira','Naila','Sobia','Rehana','Rukhsana'],
    male: ['Muhammad','Ahmed','Ali','Hassan','Usman','Bilal','Hamza','Omar','Abdullah','Ibrahim','Faisal','Tariq','Imran','Asad','Zain','Kamran','Shahid','Nadeem','Waqar','Arshad'],
    middle: ['Ur-Rehman','Ul-Islam','Ul-Haq','Ul-Amin','Ali','Hussain','Hassan','Ahmad','Iqbal','Aslam','Bibi','Begum','Akhtar','Khatun','Perveen','Sultana','Nisar','Mehmood','Raza','Shah'],
    last: ['Khan','Malik','Shah','Chaudhry','Butt','Mirza','Sheikh','Siddiqui','Ansari','Hussain','Ahmed','Ali','Qureshi','Hashmi','Iqbal','Rana','Bhatti','Gill','Cheema','Bajwa'],
  },
  IN: {
    name: 'India', flag: '🇮🇳',
    phonePrefix: '+91', phoneFormat: '##### #####',
    postalFormat: '######',
    states: ['Maharashtra','Uttar Pradesh','Tamil Nadu','Karnataka','Gujarat','Rajasthan','West Bengal','Andhra Pradesh','Madhya Pradesh','Kerala'],
    cities: ['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Ahmedabad','Pune','Surat','Jaipur','Lucknow','Chandigarh','Bhopal','Nagpur','Patna','Indore','Thane','Agra','Vadodara','Coimbatore'],
    streetTypes: ['Road','Street','Nagar','Marg','Colony','Area','Vihar','Enclave','Layout','Extension'],
    female: ['Priya','Anjali','Deepika','Pooja','Neha','Sunita','Aarti','Rekha','Kavita','Meera','Ananya','Shreya','Divya','Riya','Nisha','Swati','Pallavi','Monika','Jyoti','Radha'],
    male: ['Raj','Amit','Rahul','Vikram','Suresh','Manoj','Ravi','Arun','Vijay','Sanjay','Arjun','Rohit','Nikhil','Karan','Akash','Varun','Tushar','Pankaj','Naveen','Gaurav'],
    middle: ['Kumar','Singh','Prasad','Nath','Devi','Bai','Kumari','Lal','Ram','Das','Chand','Prakash','Rao','Reddy','Pillai','Patel','Sharma','Gupta','Verma','Mishra'],
    last: ['Sharma','Verma','Patel','Singh','Kumar','Gupta','Joshi','Mehta','Yadav','Mishra','Nair','Reddy','Rao','Pillai','Iyer','Menon','Agarwal','Shah','Chowdhury','Bose'],
  },
};

// Street number list
const STREET_NUMBERS = Array.from({ length: 299 }, (_, i) => i + 2);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDigits(n: number): string {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
}

function randomUpperLetter(): string {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function formatPhone(format: string): string {
  return format.replace(/#/g, () => String(Math.floor(Math.random() * 10)));
}

function formatPostal(format: string): string {
  return format
    .replace(/#/g, () => String(Math.floor(Math.random() * 10)))
    .replace(/A/g, randomUpperLetter);
}

export function generateDOB(): string {
  const year = 1960 + Math.floor(Math.random() * 45);
  const month = 1 + Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function generateUsername(first: string, last: string): string {
  const variants = [
    `${first.toLowerCase()}${last.toLowerCase()}`,
    `${first.toLowerCase()}.${last.toLowerCase()}`,
    `${first.toLowerCase()}${last.toLowerCase()}${randomDigits(2)}`,
    `${first.toLowerCase()[0]}${last.toLowerCase()}${randomDigits(3)}`,
    `${last.toLowerCase()}${first.toLowerCase()[0]}${randomDigits(2)}`,
  ];
  return pick(variants);
}

export interface GeneratedIdentity {
  country: CountryCode;
  gender: 'Male' | 'Female';
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  username: string;
  dob: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country_name: string;
}

export function generateIdentity(code: CountryCode, preferredGender?: 'Male' | 'Female'): GeneratedIdentity {
  const d = COUNTRIES[code];
  const gender: 'Male' | 'Female' = preferredGender || (Math.random() > 0.5 ? 'Male' : 'Female');
  const firstNames = gender === 'Female' ? d.female : d.male;

  const firstName = pick(firstNames);
  const middleName = pick(d.middle);
  const lastName = pick(d.last);
  const streetNum = pick(STREET_NUMBERS);
  const streetName = `${randomDigits(1)}${pick(['0','5','','th','rd','st','nd'])} ${pick(d.streetTypes)}`;

  return {
    country: code,
    gender,
    firstName,
    middleName,
    lastName,
    fullName: `${firstName} ${middleName} ${lastName}`,
    username: generateUsername(firstName, lastName),
    dob: generateDOB(),
    phone: `${d.phonePrefix} ${formatPhone(d.phoneFormat)}`,
    address: `${streetNum} ${pick(d.cities.slice(0, 10))} ${pick(d.streetTypes)}`,
    city: pick(d.cities),
    state: pick(d.states),
    postalCode: formatPostal(d.postalFormat),
    country_name: d.name,
  };
}
