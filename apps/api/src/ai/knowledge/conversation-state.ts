export interface UserProfileState {
  targetCountry?: string;
  interestPathway?: 'work' | 'study' | 'family' | 'investment' | 'pr' | 'tourist';
  age?: number;
  qualification?: string;
  experienceYears?: number;
  languageProficiency?: string;
  hasJobOffer?: boolean;
  applyingWithFamily?: boolean;
}

export function extractConversationProfile(
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  currentMessage: string
): { profile: UserProfileState; summaryText: string; missingQuestions: string[] } {
  const allUserText = [...history.filter((m) => m.role === 'user').map((m) => m.content), currentMessage]
    .join(' ')
    .toLowerCase();

  const profile: UserProfileState = {};

  // 1. Detect Target Country
  if (allUserText.includes('canada')) profile.targetCountry = 'Canada';
  else if (allUserText.includes('uk') || allUserText.includes('united kingdom') || allUserText.includes('britain') || allUserText.includes('england')) profile.targetCountry = 'United Kingdom';
  else if (allUserText.includes('germany') || allUserText.includes('deutschland')) profile.targetCountry = 'Germany';
  else if (allUserText.includes('australia')) profile.targetCountry = 'Australia';
  else if (allUserText.includes('usa') || allUserText.includes('united states') || allUserText.includes('america')) profile.targetCountry = 'United States';
  else if (allUserText.includes('portugal')) profile.targetCountry = 'Portugal';
  else if (allUserText.includes('spain')) profile.targetCountry = 'Spain';
  else if (allUserText.includes('malta')) profile.targetCountry = 'Malta';

  // 2. Detect Interest Pathway
  if (allUserText.includes('work') || allUserText.includes('job') || allUserText.includes('employment') || allUserText.includes('working')) {
    profile.interestPathway = 'work';
  } else if (allUserText.includes('study') || allUserText.includes('university') || allUserText.includes('scholarship') || allUserText.includes('degree') || allUserText.includes('student')) {
    profile.interestPathway = 'study';
  } else if (allUserText.includes('invest') || allUserText.includes('cbi') || allUserText.includes('golden visa') || allUserText.includes('business')) {
    profile.interestPathway = 'investment';
  } else if (allUserText.includes('family') || allUserText.includes('spouse') || allUserText.includes('sponsor husband') || allUserText.includes('sponsor wife') || allUserText.includes('parents')) {
    profile.interestPathway = 'family';
  } else if (allUserText.includes('pr') || allUserText.includes('permanent residence') || allUserText.includes('express entry')) {
    profile.interestPathway = 'pr';
  } else if (allUserText.includes('tourist') || allUserText.includes('visit') || allUserText.includes('holiday') || allUserText.includes('travel')) {
    profile.interestPathway = 'tourist';
  }

  // 3. Detect Age
  const ageMatch = allUserText.match(/\b(i am|i'm|age|aged|am)\s*(\d{2})\b/) || allUserText.match(/\b(\d{2})\s*years\s*old\b/);
  if (ageMatch) {
    const parsedAge = parseInt(ageMatch[2] || ageMatch[1], 10);
    if (parsedAge >= 16 && parsedAge <= 80) {
      profile.age = parsedAge;
    }
  }

  // 4. Detect Qualification
  if (allUserText.includes('phd') || allUserText.includes('doctorate') || allUserText.includes('doctoral')) {
    profile.qualification = 'PhD / Doctorate';
  } else if (allUserText.includes('master') || allUserText.includes('msc') || allUserText.includes('mba') || allUserText.includes('ma')) {
    profile.qualification = "Master's Degree";
  } else if (allUserText.includes('bachelor') || allUserText.includes('degree') || allUserText.includes('bsc') || allUserText.includes('ba') || allUserText.includes('undergraduate')) {
    profile.qualification = "Bachelor's Degree";
  } else if (allUserText.includes('diploma') || allUserText.includes('associate') || allUserText.includes('trade certificate')) {
    profile.qualification = 'Post-Secondary Diploma / Certificate';
  } else if (allUserText.includes('high school') || allUserText.includes('secondary school')) {
    profile.qualification = 'High School';
  }

  // 5. Detect Experience
  const expMatch = allUserText.match(/(\d+)\s*(?:\+)?\s*(?:years?|yrs?)(?:\s*of)?\s*(?:experience|work|working)/) || allUserText.match(/(?:experience|work for)\s*(\d+)\s*years?/);
  if (expMatch) {
    profile.experienceYears = parseInt(expMatch[1], 10);
  }

  // 6. Detect Language
  if (allUserText.includes('ielts') || allUserText.includes('celpip') || allUserText.includes('toefl') || allUserText.includes('pte') || allUserText.includes('clb')) {
    profile.languageProficiency = 'Tested (IELTS/CELPIP/PTE)';
  } else if (allUserText.includes('fluent in english') || allUserText.includes('fluent english') || allUserText.includes('native english') || allUserText.includes('good english') || allUserText.includes('advanced english')) {
    profile.languageProficiency = 'Fluent English';
  } else if (allUserText.includes('french') || allUserText.includes('tef') || allUserText.includes('tcf')) {
    profile.languageProficiency = 'French / Bilingual';
  }

  // 7. Detect Job Offer
  if (allUserText.includes('have a job offer') || allUserText.includes('have an offer') || allUserText.includes('got a job offer') || allUserText.includes('employer sponsor')) {
    profile.hasJobOffer = true;
  } else if (allUserText.includes('no job offer') || allUserText.includes('without job offer') || allUserText.includes("don't have a job offer") || allUserText.includes("dont have a job offer")) {
    profile.hasJobOffer = false;
  }

  // 8. Detect Family / Dependents
  if (allUserText.includes('with my wife') || allUserText.includes('with my husband') || allUserText.includes('with my family') || allUserText.includes('married') || allUserText.includes('with kids') || allUserText.includes('with children')) {
    profile.applyingWithFamily = true;
  } else if (allUserText.includes('alone') || allUserText.includes('single') || allUserText.includes('individual applicant') || allUserText.includes('just myself')) {
    profile.applyingWithFamily = false;
  }

  // Build Summary of Known Facts
  const knownParts: string[] = [];
  if (profile.targetCountry) knownParts.push(`Destination: ${profile.targetCountry}`);
  if (profile.interestPathway) knownParts.push(`Interest: ${profile.interestPathway.toUpperCase()}`);
  if (profile.age) knownParts.push(`Age: ${profile.age}`);
  if (profile.qualification) knownParts.push(`Education: ${profile.qualification}`);
  if (profile.experienceYears !== undefined) knownParts.push(`Experience: ${profile.experienceYears} years`);
  if (profile.languageProficiency) knownParts.push(`Language: ${profile.languageProficiency}`);
  if (profile.hasJobOffer !== undefined) knownParts.push(`Job Offer: ${profile.hasJobOffer ? 'Yes' : 'No'}`);
  if (profile.applyingWithFamily !== undefined) knownParts.push(`Family: ${profile.applyingWithFamily ? 'With Family' : 'Single'}`);

  const summaryText = knownParts.length ? knownParts.join(' | ') : 'No specific user profile variables recorded yet.';

  // Determine Missing Profiling Questions
  const missingQuestions: string[] = [];
  if (!profile.interestPathway) {
    missingQuestions.push('Are you primarily interested in work, study, family sponsorship, business/investment, or permanent residence?');
  } else {
    if (profile.age === undefined) missingQuestions.push("What is your age?");
    if (!profile.qualification) missingQuestions.push("What is your highest educational qualification (Bachelor's, Master's, PhD, etc.)?");
    if (profile.experienceYears === undefined && (profile.interestPathway === 'work' || profile.interestPathway === 'pr')) {
      missingQuestions.push("How many years of full-time skilled work experience do you have?");
    }
    if (!profile.languageProficiency) missingQuestions.push("What is your English or French language proficiency (or have you taken IELTS/CELPIP)?");
    if (profile.hasJobOffer === undefined && profile.interestPathway === 'work') {
      missingQuestions.push("Do you currently have a job offer in your target country?");
    }
    if (profile.applyingWithFamily === undefined) {
      missingQuestions.push("Are you applying individually or with family dependents (spouse/children)?");
    }
  }

  return { profile, summaryText, missingQuestions };
}
