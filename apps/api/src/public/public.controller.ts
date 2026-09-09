import { Controller, Get, Query, Param, Post, Body, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Controller()
export class PublicController {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  @Get('faqs')
  async getFaqs(@Query('category') category?: string) {
    const cacheKey = `faqs:${category || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.faq.findMany({
      where: category ? { category } : undefined,
      orderBy: { order: 'asc' },
    });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('packages')
  async getPackages() {
    const cacheKey = 'packages';
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // invalid cache, continue
      }
    }

    const data = await this.prisma.servicePackage.findMany({
      where: {},
      orderBy: { serviceFee: 'asc' },
    });
    if (data && data.length > 0) {
      await this.redis.set(cacheKey, data, 300);
      return data;
    }

    const adminPackages = await this.prisma.adminServicePackage.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
    if (adminPackages && adminPackages.length > 0) {
      const mapped = adminPackages.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.type,
        description: p.description,
        serviceFee: p.price,
        currency: 'USD',
        includes: p.features,
        imageUrl: p.imageUrl,
        isActive: p.isActive,
      }));
      await this.redis.set(cacheKey, mapped, 300);
      return mapped;
    }

    const defaultPackages = [
      {
        id: 'family-relocation',
        name: 'Family Relocation',
        category: 'Family',
        description: 'Comprehensive family immigration support to ensure smooth relocation and settlement for your entire family.',
        includes: ['Eligibility Assessment', 'Dependent Applications', 'Document Preparation', 'Family Settlement Guidance', 'School Enrollment Support'],
        serviceFee: 2500,
        currency: 'USD',
        isActive: true,
      },
      {
        id: 'student-success',
        name: 'Student Success',
        category: 'Education',
        description: 'End-to-end guidance for international students, from program selection and university admission to student visa acquisition and pre-departure planning.',
        includes: ['University Matching', 'Scholarship Search', 'Admission Assistance', 'Student Visa Filing', 'Pre-Departure Briefing'],
        serviceFee: 1200,
        currency: 'USD',
        isActive: true,
      },
      {
        id: 'skilled-worker',
        name: 'Skilled Worker',
        category: 'Work',
        description: 'Dedicated pathway assistance for skilled professionals aiming for work permits and permanent residency.',
        includes: ['Job Matching', 'Work Permit Application', 'Document Review', 'Points Assessment', 'Resume & Credential Evaluation'],
        serviceFee: 3000,
        currency: 'USD',
        isActive: true,
      },
    ];
    return defaultPackages;
  }

  @Get('admin-packages')
  async getAdminPackages() {
    const cacheKey = 'admin-packages';
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // invalid cache, continue
      }
    }

    const data = await this.prisma.servicePackage.findMany({
      where: {},
      orderBy: { createdAt: 'desc' },
    });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('packages/:id')
  async getPackage(@Param('id') id: string) {
    const cacheKey = `package:${id}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // invalid cache, continue
      }
    }

    let data = await this.prisma.servicePackage.findUnique({
      where: { id },
    });

    if (!data) {
      const adminPkg = await this.prisma.adminServicePackage.findUnique({
        where: { id },
      });
      if (adminPkg) {
        data = {
          id: adminPkg.id,
          name: adminPkg.name,
          category: adminPkg.type,
          description: adminPkg.description,
          serviceFee: adminPkg.price,
          currency: 'USD',
          includes: adminPkg.features,
          imageUrl: adminPkg.imageUrl,
          isActive: adminPkg.isActive,
          createdAt: adminPkg.createdAt,
          updatedAt: adminPkg.updatedAt,
        } as any;
      }
    }

    if (!data) {
      const defaultPackagesMap: Record<string, any> = {
        'family-relocation': {
          id: 'family-relocation',
          name: 'Family Relocation',
          category: 'Family',
          description: 'Comprehensive family immigration support to ensure smooth relocation and settlement for your entire family.',
          includes: ['Eligibility Assessment', 'Dependent Applications', 'Document Preparation', 'Family Settlement Guidance', 'School Enrollment Support'],
          serviceFee: 2500,
          currency: 'USD',
          isActive: true,
        },
        'student-success': {
          id: 'student-success',
          name: 'Student Success',
          category: 'Education',
          description: 'End-to-end guidance for international students, from program selection and university admission to student visa acquisition and pre-departure planning.',
          includes: ['University Matching', 'Scholarship Search', 'Admission Assistance', 'Student Visa Filing', 'Pre-Departure Briefing'],
          serviceFee: 1200,
          currency: 'USD',
          isActive: true,
        },
        'skilled-worker': {
          id: 'skilled-worker',
          name: 'Skilled Worker',
          category: 'Work',
          description: 'Dedicated pathway assistance for skilled professionals aiming for work permits and permanent residency.',
          includes: ['Job Matching', 'Work Permit Application', 'Document Review', 'Points Assessment', 'Resume & Credential Evaluation'],
          serviceFee: 3000,
          currency: 'USD',
          isActive: true,
        },
      };

      if (defaultPackagesMap[id]) {
        return defaultPackagesMap[id];
      }
    }

    if (!data) {
      throw new NotFoundException(`Package with ID "${id}" not found`);
    }

    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('admin-scholarships')
  async getAdminScholarships() {
    const cacheKey = 'admin-scholarships';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    let data = await this.prisma.scholarship.findMany({
      orderBy: { deadline: 'asc' },
    });
    if (!data || data.length === 0) {
      data = this.getDefaultScholarships();
    }
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('scholarships')
  async getScholarships(
    @Query('country') country?: string,
    @Query('university') university?: string,
    @Query('search') search?: string,
  ) {
    const cacheKey = `scholarships:${country || ''}:${university || ''}:${search || ''}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const where: any = {};
    if (country) where.countryId = country;
    if (university) where.universityId = university;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    let data = await this.prisma.scholarship.findMany({
      where,
      include: { university: true, country: true },
      orderBy: { deadline: 'asc' },
    });

    if (!data || data.length === 0) {
      // Return filtered default scholarships
      data = this.getDefaultScholarships().filter((s: any) => {
        if (country && s.country?.id !== country && s.country?.code !== country) return false;
        if (university && s.university?.id !== university && s.university?.name !== university) return false;
        if (search) {
          const sLower = search.toLowerCase();
          const matchName = (s.name || '').toLowerCase().includes(sLower);
          const matchDesc = (s.description || '').toLowerCase().includes(sLower);
          const matchUni = (s.university?.name || '').toLowerCase().includes(sLower);
          const matchCountry = (s.country?.name || '').toLowerCase().includes(sLower);
          if (!matchName && !matchDesc && !matchUni && !matchCountry) return false;
        }
        return true;
      });
    }

    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('scholarships/:id')
  async getScholarship(@Param('id') id: string) {
    const cacheKey = `scholarship:${id}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    let data = await this.prisma.scholarship.findUnique({
      where: { id },
      include: { university: true, country: true },
    });

    if (!data) {
      data = this.getDefaultScholarships().find(
        (s: any) => s.id === id || s.id.toLowerCase() === id.toLowerCase()
      );
    }

    if (data) await this.redis.set(cacheKey, data, 300);
    return data;
  }

  private getDefaultScholarships(): any[] {
    return [
      {
        id: 'fulbright-foreign-student-usa',
        name: 'Fulbright Foreign Student Program',
        description: 'Prestigious fellowship enabling graduate students, young professionals, and artists to study and conduct research in the United States. Covers full tuition, airfare, monthly living stipend, and health insurance.',
        fundingAmount: 50000,
        deadline: '2026-10-31T23:59:59.000Z',
        link: 'https://foreign.fulbrightonline.org/',
        eligibilityJson: {
          degreeLevel: ["Master's", "PhD"],
          academicRequirement: 'Bachelor degree with minimum 3.0 GPA or equivalent',
          languageTest: 'TOEFL iBT 90+ or IELTS 7.0+',
          benefits: ['Full Tuition Coverage', 'Monthly Living Stipend ($2,000 - $2,500/mo)', 'Round-trip Airfare', 'J-1 Visa Sponsorship', 'Comprehensive Health Insurance'],
          requiredDocuments: ['Academic Transcripts', '3 Letters of Recommendation', 'Statement of Purpose / Research Objective', 'Standardized Test Scores', 'Passport Copy'],
          fieldsOfStudy: 'All academic fields except clinical medicine',
          coverageType: 'Full Scholarship',
        },
        university: {
          id: 'harvard-university-us',
          name: 'Harvard University & Top US Institutions',
          ranking: 1,
          tuitionRange: '$54,000 - $62,000 / year',
          website: 'https://www.harvard.edu',
        },
        country: {
          id: 'country-us',
          code: 'US',
          name: 'United States',
          currency: 'USD',
        },
      },
      {
        id: 'chevening-scholarship-uk',
        name: 'Chevening Scholarships UK',
        description: "The UK government's global scholarship programme funded by the FCDO. Offers full financial support to study for any eligible one-year master's degree at any UK university.",
        fundingAmount: 45000,
        deadline: '2026-11-05T23:59:59.000Z',
        link: 'https://www.chevening.org/',
        eligibilityJson: {
          degreeLevel: ["Master's (One-year taught)"],
          academicRequirement: 'Undergraduate degree equivalent to UK upper second-class 2:1 honours',
          workExperience: 'Minimum 2 years (2,800 hours) of work experience',
          languageTest: 'English language proficiency fulfilled with university acceptance',
          benefits: ['Full University Tuition Fees', 'Monthly Living Allowance', 'Economy Return Flights to the UK', 'Arrival & Departure Allowances', 'Visa Application Fee & Travel Grant'],
          requiredDocuments: ['Valid Passport', 'Degree Certificates & Transcripts', '2 Professional References', '3 Selected UK Master Choices', 'Essays on Leadership & Networking'],
          fieldsOfStudy: 'All subject areas',
          coverageType: 'Fully Funded',
        },
        university: {
          id: 'oxford-cambridge-uk',
          name: 'University of Oxford / Cambridge / Imperial',
          ranking: 2,
          tuitionRange: '£28,000 - £44,000 / year',
          website: 'https://www.ox.ac.uk',
        },
        country: {
          id: 'country-gb',
          code: 'GB',
          name: 'United Kingdom',
          currency: 'GBP',
        },
      },
      {
        id: 'daad-helmut-schmidt-germany',
        name: 'DAAD Helmut-Schmidt-Programme',
        description: 'Supports future leaders from international partner countries aiming to promote democracy and social governance. Covers full tuition, €934 monthly stipend, German courses, and health insurance.',
        fundingAmount: 32000,
        deadline: '2026-07-31T23:59:59.000Z',
        link: 'https://www.daad.de/',
        eligibilityJson: {
          degreeLevel: ["Master's (Public Policy & Good Governance)"],
          academicRequirement: 'First university degree with above-average grades',
          languageTest: 'English proficiency (IELTS 6.5+ or TOEFL iBT 80+)',
          benefits: ['Full Tuition Exemption', 'Monthly Scholarship Rate of €934', 'Health & Accident Insurance in Germany', 'Appropriate Travel Allowance', 'Study & Research Subsidy + Rent Allowance'],
          requiredDocuments: ['DAAD Application Form', 'Hand-signed Letter of Motivation', 'Curriculum Vitae (Europass format)', 'Copies of Degrees & Transcripts', 'Proof of English Proficiency'],
          fieldsOfStudy: 'Public Policy, Governance, Economics, Social Sciences',
          coverageType: 'Fully Funded',
        },
        university: {
          id: 'tum-heidelberg-de',
          name: 'Technical University of Munich & Partner Institutions',
          ranking: 28,
          tuitionRange: 'Free tuition / Semester fee only',
          website: 'https://www.tum.de',
        },
        country: {
          id: 'country-de',
          code: 'DE',
          name: 'Germany',
          currency: 'EUR',
        },
      },
      {
        id: 'australia-awards-scholarship',
        name: 'Australia Awards Scholarships',
        description: 'Prestigious long-term awards administered by the Australian Department of Foreign Affairs and Trade for full-time undergraduate or postgraduate study at participating Australian universities.',
        fundingAmount: 60000,
        deadline: '2026-08-30T23:59:59.000Z',
        link: 'https://www.dfat.gov.au/people-to-people/australia-awards',
        eligibilityJson: {
          degreeLevel: ["Bachelor's", "Master's", "PhD"],
          academicRequirement: 'Tertiary qualification matching Australian university entry standards',
          languageTest: 'IELTS 6.5 (no band below 6.0) or TOEFL iBT 84',
          benefits: ['Full Tuition Fees', 'Return Economy Air Travel', 'Establishment Allowance ($5,000 AUD)', 'Contribution to Living Expenses (CLE)', 'Overseas Student Health Cover (OSHC)'],
          requiredDocuments: ['Passport Copy', 'Certified Educational Certificates & Transcripts', 'Referee Reports', 'Curriculum Vitae', 'Development Impact Plan'],
          fieldsOfStudy: 'Priority development sectors, STEM, Energy, Governance, Health',
          coverageType: 'Full Scholarship',
        },
        university: {
          id: 'melbourne-anu-au',
          name: 'University of Melbourne & Group of Eight',
          ranking: 13,
          tuitionRange: '$38,000 - $52,000 AUD / year',
          website: 'https://www.unimelb.edu.au',
        },
        country: {
          id: 'country-au',
          code: 'AU',
          name: 'Australia',
          currency: 'AUD',
        },
      },
      {
        id: 'vanier-cgs-canada',
        name: 'Vanier Canada Graduate Scholarships',
        description: 'Attracts and retains world-class doctoral students by supporting students who demonstrate both leadership skills and a high standard of scholarly achievement in graduate studies.',
        fundingAmount: 50000,
        deadline: '2026-11-01T23:59:59.000Z',
        link: 'https://vanier.gc.ca/',
        eligibilityJson: {
          degreeLevel: ['PhD / Doctoral Studies'],
          academicRequirement: 'First-class average (e.g. A- / 3.7+ GPA) in each of the last two years of full-time study',
          nomination: 'Must be nominated by a Canadian institution with a Vanier quota allocation',
          benefits: ['$50,000 CAD per year for 3 years ($150,000 Total)', 'Institutional Research Grants', 'Work permit and PR Pathway support'],
          requiredDocuments: ['Research Proposal (maximum 2 pages)', 'Project References', 'Leadership Statement', 'Special Circumstances Document', 'Official Transcripts & Two Referee Letters'],
          fieldsOfStudy: 'Health Research, Natural Sciences & Engineering, Social Sciences & Humanities',
          coverageType: 'High-Value Grant ($150,000)',
        },
        university: {
          id: 'toronto-mcgill-ca',
          name: 'University of Toronto & McGill University',
          ranking: 21,
          tuitionRange: '$40,000 - $60,000 CAD / year',
          website: 'https://www.utoronto.ca',
        },
        country: {
          id: 'country-ca',
          code: 'CA',
          name: 'Canada',
          currency: 'CAD',
        },
      },
      {
        id: 'eiffel-excellence-scholarship-france',
        name: 'Eiffel Excellence Scholarship Program',
        description: 'Developed by the French Ministry for Europe and Foreign Affairs to enable French higher education institutions to attract elite foreign students for master’s and PhD programs.',
        fundingAmount: 38000,
        deadline: '2026-10-15T23:59:59.000Z',
        link: 'https://www.campusfrance.org/en/eiffel-scholarship-program-excellence',
        eligibilityJson: {
          degreeLevel: ["Master's", "PhD"],
          ageLimit: 'Up to 25 years old for Master level, up to 30 for PhD level',
          languageTest: 'DELF/DALF for French tracks, IELTS/TOEFL for 100% English taught programs',
          benefits: ['Monthly Allowance of €1,181 to €1,800', 'International Return Airfare', 'National Health Insurance & Social Security', 'Cultural Activities & Housing Assistance Grants'],
          requiredDocuments: ['Candidate Resume & Cover Letter', 'Complete Transcripts of Higher Education', 'Institutional Nomination Dossier', 'Research Project / Professional Career Plan', 'Proof of Language Competency'],
          fieldsOfStudy: 'Science & Technology, Economics & Management, Law & Political Sciences',
          coverageType: 'Fully Funded',
        },
        university: {
          id: 'sorbonne-polytechnique-fr',
          name: 'Sorbonne University & École Polytechnique',
          ranking: 45,
          tuitionRange: '€2,770 - €3,770 / year (Standard Public Rate)',
          website: 'https://www.sorbonne-universite.fr',
        },
        country: {
          id: 'country-fr',
          code: 'FR',
          name: 'France',
          currency: 'EUR',
        },
      },
      {
        id: 'swiss-govt-excellence-scholarship',
        name: 'Swiss Government Excellence Scholarships',
        description: 'Offered by the Swiss Confederation to foreign researchers who have completed a master’s degree or PhD and foreign artists holding a bachelor’s degree.',
        fundingAmount: 42000,
        deadline: '2026-11-30T23:59:59.000Z',
        link: 'https://www.sbfi.admin.ch/scholarships_eng',
        eligibilityJson: {
          degreeLevel: ['Research Fellowship', 'PhD', 'Postdoctoral'],
          academicRequirement: 'Master degree achieved before 31 July 2026 with academic excellence',
          mentorRequirement: 'Written confirmation from an academic host professor in Switzerland',
          benefits: ['Monthly Stipend of CHF 1,920 (PhD) to CHF 3,500 (Postdoc)', 'Mandatory Swiss Health Insurance', 'Flight Allowance for Non-EU/EFTA Candidates', 'Special 300 CHF Housing Allowance'],
          requiredDocuments: ['FCS Application Form', 'Detailed Research Proposal & Timeline', 'Letter of Invitation from Swiss Professor', '2 Confidential Letters of Recommendation', 'Certified Copies of Degrees'],
          fieldsOfStudy: 'All Academic Fields',
          coverageType: 'Fully Funded Fellowship',
        },
        university: {
          id: 'eth-zurich-epfl-ch',
          name: 'ETH Zurich & EPFL Switzerland',
          ranking: 7,
          tuitionRange: 'CHF 1,460 / year (Subsidized)',
          website: 'https://ethz.ch',
        },
        country: {
          id: 'country-ch',
          code: 'CH',
          name: 'Switzerland',
          currency: 'CHF',
        },
      },
      {
        id: 'mext-scholarship-japan',
        name: 'MEXT Japanese Government Scholarship',
        description: 'Fully funded scholarship awarded by Japan’s Ministry of Education, Culture, Sports, Science and Technology (MEXT) for undergraduate, master’s, and PhD international students.',
        fundingAmount: 35000,
        deadline: '2026-09-15T23:59:59.000Z',
        link: 'https://www.studyinjapan.go.jp/en/planning/scholarship/mext-scholarships/',
        eligibilityJson: {
          degreeLevel: ["Undergraduate", "Master's", "PhD"],
          ageRequirement: 'Under 35 years of age for graduate research scholars',
          languageRequirement: 'Willingness to learn Japanese (6-month preparatory course provided)',
          benefits: ['100% Full Tuition Exemption & Entrance Examination Fee', 'Monthly Stipend of 143,000 to 145,000 JPY', 'Round-trip International Airfare', 'Japanese Language Training Included'],
          requiredDocuments: ['Field of Study and Research Plan', 'Certified Academic Transcripts', 'Graduation Certificate / Diploma', 'Recommendation Letter from Dean or Advisor', 'Medical Certificate'],
          fieldsOfStudy: 'Humanities, Social Sciences, Natural Sciences, Engineering, Medicine',
          coverageType: 'Full Government Scholarship',
        },
        university: {
          id: 'tokyo-kyoto-jp',
          name: 'University of Tokyo & Kyoto University',
          ranking: 23,
          tuitionRange: '535,800 JPY / year (Waived for Scholars)',
          website: 'https://www.u-tokyo.ac.jp',
        },
        country: {
          id: 'country-jp',
          code: 'JP',
          name: 'Japan',
          currency: 'JPY',
        },
      },
      {
        id: 'singa-award-singapore',
        name: 'Singapore International Graduate Award (SINGA)',
        description: 'A collaboration between A*STAR, NTU, NUS, and SUTD. Receive PhD training in Singapore in English at premier research institutes and world top-ranked universities.',
        fundingAmount: 40000,
        deadline: '2026-12-01T23:59:59.000Z',
        link: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa',
        eligibilityJson: {
          degreeLevel: ['PhD in Biomedical Sciences / Physical Sciences & Engineering'],
          academicRequirement: 'Graduates with passion for research and excellent academic results',
          languageTest: 'Good skills in written and spoken English (IELTS / TOEFL optional but recommended)',
          benefits: ['Full Tuition Fee Coverage for 4 Years', 'Monthly Stipend of SGD 2,700 (increased to SGD 3,200 after qualifying exam)', 'One-time Airfare Grant of up to SGD 1,500', 'One-time Settling-in Allowance of SGD 1,000'],
          requiredDocuments: ['Valid Passport', 'Recent Passport-sized Photo', 'Academic Transcripts (Bachelor and Master if applicable)', '2 Academic Referee Reports', 'Statement of Purpose for PhD Research'],
          fieldsOfStudy: 'Biomedical Sciences, Computing & Information Sciences, Engineering & Physical Sciences',
          coverageType: 'Full 4-Year PhD Fellowship',
        },
        university: {
          id: 'nus-ntu-sg',
          name: 'National University of Singapore (NUS) & NTU',
          ranking: 8,
          tuitionRange: 'SGD 38,000 - SGD 50,000 / year (Fully Funded)',
          website: 'https://nus.edu.sg',
        },
        country: {
          id: 'country-sg',
          code: 'SG',
          name: 'Singapore',
          currency: 'SGD',
        },
      },
      {
        id: 'ireland-govt-scholarship',
        name: 'Government of Ireland International Education Scholarship',
        description: 'Awarded by the Higher Education Authority (HEA) to high-calibre students from non-EEA countries for one year of full-time master’s or doctoral studies in Ireland.',
        fundingAmount: 30000,
        deadline: '2026-08-15T23:59:59.000Z',
        link: 'https://hea.ie/funding-governance-performance/funding/student-finance/government-of-ireland-international-education-scholarships/',
        eligibilityJson: {
          degreeLevel: ["Master's (1-Year)", "PhD (Final Year)"],
          academicRequirement: 'Hold an offer of a place on a full-time qualifying master or PhD programme at an eligible Irish HEI',
          benefits: ['Full Tuition Fee Waiver at Host Irish Institution', '€10,000 Direct Living Stipend for One Study Year', 'Fast-track Graduate Work Visa (Stamp 1G) Opportunity'],
          requiredDocuments: ['Formal Offer Letter from Irish Higher Education Institution', 'Academic Transcripts & Degree Certificates', '2 Academic / Professional Reference Letters', 'Personal Statement detailing contribution to Ireland’s international relations'],
          fieldsOfStudy: 'All disciplines across Irish universities and institutes of technology',
          coverageType: 'Full Fee Waiver + €10k Stipend',
        },
        university: {
          id: 'trinity-ucd-ie',
          name: 'Trinity College Dublin & University College Dublin',
          ranking: 81,
          tuitionRange: '€18,000 - €26,000 / year',
          website: 'https://www.tcd.ie',
        },
        country: {
          id: 'country-ie',
          code: 'IE',
          name: 'Ireland',
          currency: 'EUR',
        },
      },
    ];
  }

  @Get('consultants')
  async getConsultants() {
    const cacheKey = 'consultants';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.consultantProfile.findMany({
      include: { user: { select: { email: true, profile: true } } },
    });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('universities')
  async getUniversities() {
    const cacheKey = 'universities';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    let data = await this.prisma.university.findMany({
      include: { country: true, scholarships: true },
    });

    if (!data || data.length === 0) {
      // Return default universities from default scholarships
      const uniqueUnis = new Map<string, any>();
      for (const s of this.getDefaultScholarships()) {
        if (s.university && !uniqueUnis.has(s.university.id)) {
          uniqueUnis.set(s.university.id, {
            ...s.university,
            country: s.country,
            countryId: s.country?.id,
            scholarships: [{ id: s.id, name: s.name, fundingAmount: s.fundingAmount, deadline: s.deadline }],
          });
        }
      }
      data = Array.from(uniqueUnis.values());
    }

    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('offices')
  async getOffices() {
    const cacheKey = 'offices';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.office.findMany({
      include: { country: true },
      orderBy: { countryId: 'asc' },
    });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('partners')
  async getPartners() {
    const cacheKey = 'partners';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.partner.findMany({
      orderBy: { name: 'asc' },
    });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('programs')
  async getPrograms() {
    const cacheKey = 'programs';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.program.findMany({ orderBy: { title: 'asc' } });
    await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('programs/:slug')
  async getProgram(@Param('slug') slug: string) {
    const cacheKey = `program:${slug}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.program.findUnique({ where: { slug } });
    if (data) await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('pages/:slug')
  async getPage(@Param('slug') slug: string) {
    const cacheKey = `page:${slug}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await this.prisma.page.findUnique({ where: { slug } });
    if (data) await this.redis.set(cacheKey, data, 300);
    return data;
  }

  @Get('news')
  async getNews() {
    return this.prisma.news.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('news/:id')
  async getNewsItem(@Param('id') id: string) {
    return this.prisma.news.findUnique({ where: { id } });
  }

  @Post('newsletter/subscribe')
  async subscribeNewsletter(@Body() body: { email: string }) {
    if (!body.email) return { success: false, message: 'Email required' };
    try {
      await this.prisma.subscriber.create({ data: { email: body.email } });
      return { success: true, message: 'Subscribed successfully' };
    } catch (error) {
      return { success: false, message: 'Email already subscribed or invalid' };
    }
  }
}