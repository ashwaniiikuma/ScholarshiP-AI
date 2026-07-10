import { createContext, useContext, useEffect, useState } from 'react';
import {
  activityFeed,
  applicationItems,
  assistantQuickReplies,
  deadlineItems,
  initialAssistantMessages,
  initialNotifications,
  programs,
  recommendedPrograms,
} from '../data/mockData';

const STORAGE_KEY = 'scholarhub-react-state-v1';

const defaultState = {
  authMode: 'login',
  profile: {
    name: 'Arjun Kumar',
    email: 'arjun.kumar@example.com',
    phone: '+91 98765 43210',
    course: 'B.Tech Computer Science',
    year: '2nd Year',
    educationLevel: 'Undergraduate',
  },
  personal: {
    fullName: 'Arjun Kumar',
    dob: '2004-08-15',
    gender: 'Male',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    mobile: '+91 98765 43210',
  },
  academic: {
    course: 'Undergraduate - Year 2',
    stream: 'Computer Science / IT',
    year: 'Semester 3',
    institution: 'Institute of Engineering and Technology, Lucknow',
    marks: '8.5 / 10',
  },
  financial: {
    incomeRange: 'Rs 2,50,000 - Rs 5,00,000',
    annualIncome: 250000,
    category: 'OBC',
    hostelResident: 'No',
    certificateName: 'income-certificate.pdf',
  },
  registration: {
    status: 'idle',
    registeredAt: null,
    lastResponse: null,
  },
  declarationAccepted: true,
  applicationStatus: 'draft',
  submittedAt: null,
  selectedProgramId: 'sbi-scholarship',
  notifications: initialNotifications,
  assistantMessages: initialAssistantMessages,
};

const AppContext = createContext(null);

function loadState() {
  if (typeof window === 'undefined') {
    return defaultState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
    }

    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      profile: { ...defaultState.profile, ...parsed.profile },
      personal: { ...defaultState.personal, ...parsed.personal },
      academic: { ...defaultState.academic, ...parsed.academic },
      financial: { ...defaultState.financial, ...parsed.financial },
      registration: { ...defaultState.registration, ...parsed.registration },
    };
  } catch {
    return defaultState;
  }
}

function getIncomeRangeLabel(income) {
  if (income < 100000) {
    return 'Below Rs 1,00,000';
  }

  if (income < 250000) {
    return 'Rs 1,00,000 - Rs 2,50,000';
  }

  if (income < 500000) {
    return 'Rs 2,50,000 - Rs 5,00,000';
  }

  if (income < 800000) {
    return 'Rs 5,00,000 - Rs 8,00,000';
  }

  return 'Above Rs 8,00,000';
}

function getAssistantReply(text, state) {
  const normalized = text.toLowerCase();
  const selectedProgram =
    programs.find((program) => program.id === state.selectedProgramId) ?? programs[0];

  if (normalized.includes('document')) {
    return `You should keep these ready for ${selectedProgram.title}: ${selectedProgram.documents.join(', ')}. The income certificate is the most common blocker right now.`;
  }

  if (normalized.includes('deadline') || normalized.includes('last date')) {
    return `${selectedProgram.title} is currently tracked with a deadline of ${selectedProgram.deadline}. I would finish the review step at least 48 hours before that date.`;
  }

  if (normalized.includes('eligible') || normalized.includes('eligibility')) {
    return `For ${selectedProgram.title}, the main checks are: ${selectedProgram.eligibility.join('; ')}. Based on your current profile, you are still within the strongest fit range.`;
  }

  if (normalized.includes('nsp')) {
    return 'For NSP, complete your identity, academic, and bank details first. Then verify scheme-specific income and category rules before final submission.';
  }

  if (normalized.includes('income') || normalized.includes('category')) {
    return `Your current financial profile is set to ${state.financial.incomeRange} and category ${state.financial.category}. That keeps several merit-cum-means style scholarships open.`;
  }

  return `I can help with eligibility, documents, deadlines, or next actions. Right now I would focus on ${selectedProgram.title} because it has the highest fit score in your dashboard.`;
}

function calculateCompletion(currentState) {
  const checkpoints = [
    currentState.personal.fullName,
    currentState.personal.dob,
    currentState.personal.gender,
    currentState.personal.state,
    currentState.personal.city,
    currentState.academic.course,
    currentState.academic.stream,
    currentState.academic.year,
    currentState.academic.institution,
    currentState.academic.marks,
    currentState.financial.incomeRange,
    currentState.financial.category,
    currentState.financial.hostelResident,
  ];

  const filled = checkpoints.filter(Boolean).length;
  return Math.round((filled / checkpoints.length) * 100);
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setAuthMode = (mode) => {
    setState((current) => ({
      ...current,
      authMode: mode,
    }));
  };

  const applyRegistrationProfile = (registrationForm, response) => {
    const annualIncome = Number(registrationForm.income);
    const cgpa = Number(registrationForm.cgpa);

    setState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        name: registrationForm.name.trim(),
        email: registrationForm.email.trim().toLowerCase(),
        educationLevel: registrationForm.educationLevel,
      },
      personal: {
        ...current.personal,
        fullName: registrationForm.name.trim(),
        state: registrationForm.state,
      },
      academic: {
        ...current.academic,
        course: registrationForm.educationLevel,
        marks: Number.isFinite(cgpa) ? String(cgpa) : current.academic.marks,
      },
      financial: {
        ...current.financial,
        category: registrationForm.category,
        annualIncome,
        incomeRange: Number.isFinite(annualIncome)
          ? getIncomeRangeLabel(annualIncome)
          : current.financial.incomeRange,
      },
      registration: {
        status: 'registered',
        registeredAt: new Date().toISOString(),
        lastResponse: response,
      },
    }));
  };

  const updateSection = (section, updates) => {
    setState((current) => {
      const nextState = {
        ...current,
        [section]: {
          ...current[section],
          ...updates,
        },
      };

      if (section === 'personal' && updates.fullName) {
        nextState.profile = {
          ...nextState.profile,
          name: updates.fullName,
        };
      }

      if (section === 'personal' && updates.mobile) {
        nextState.profile = {
          ...nextState.profile,
          phone: updates.mobile,
        };
      }

      if (section === 'academic') {
        nextState.profile = {
          ...nextState.profile,
          course: nextState.academic.stream || nextState.profile.course,
          year: nextState.academic.year || nextState.profile.year,
        };
      }

      return nextState;
    });
  };

  const toggleDeclaration = () => {
    setState((current) => ({
      ...current,
      declarationAccepted: !current.declarationAccepted,
    }));
  };

  const setSelectedProgram = (programId) => {
    setState((current) => ({
      ...current,
      selectedProgramId: programId,
    }));
  };

  const markNotificationRead = (notificationId) => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    }));
  };

  const markAllNotificationsRead = () => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }));
  };

  const sendAssistantMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    setState((current) => {
      const userMessage = {
        id: `msg-user-${Date.now()}`,
        role: 'user',
        content: trimmed,
      };
      const botMessage = {
        id: `msg-bot-${Date.now() + 1}`,
        role: 'bot',
        content: getAssistantReply(trimmed, current),
      };

      return {
        ...current,
        assistantMessages: [...current.assistantMessages, userMessage, botMessage],
      };
    });
  };

  const resetAssistantConversation = () => {
    setState((current) => ({
      ...current,
      assistantMessages: initialAssistantMessages,
    }));
  };

  const submitApplication = async () => {
    //1. Frontend se saara data samet kar backend ke schema ke hisab se taiyar hoga
    console.log("Bhai ye raha poora state:", state);
    const finalProfileData ={
      name: state.personal?.fullName,
      dateOfBirth: state.personal?.dob,
      gender: state.personal?.gender,
      city: state.personal?.city,
      state: state.personal?.state,

      //Academic details
      collegeName: state.academic?.course || "College",
      educationLevel:state.academic?.stream || "Undergraduate",
      cgpa: Number(state.academic?.marks) || 0,

      //Final details
      income: Number(state.financial?.incomeRange?.replace(/[^0-9]/g, '')) || 0,//Only take a Numbers for the text 
      category: state.financial?.category,
      studentType: "College"  // he Passed the default enum value
    
    };

    try{ 

      const userId = state.registration?.lastResponse?._id || state.registration?.lastResponse?.user?._id;

        console.log("Full registration state:", state.registration);
console.log("lastResponse:", state.registration?.lastResponse);
console.log("userId mili:", userId);

      if(!userId) {
        console.error("User ID nahi mili! pehele login/signup check karo.");
      return;
      }
const response = await fetch(`http://localhost:5000/user/update-profile/${userId}`, { 
     
  
  method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalProfileData),
      });

      if (!response.ok) {
        throw new Error("Database me profile save nhi ho payi.");
      }
      const data = await response.json();
      console.log("Backend Response:", data);
    
    

      // if data saved in databse, so as it's submitted on fronted
    setState((current) => ({
      ...current,
      applicationStatus: 'submitted',
      submittedAt: new Date().toISOString(),
      notifications: [
        {
          id: `notif-submit-${Date.now()}`,
          category: 'application',
          title: 'Application submitted successfully',
          description: 'Your review packet was sent to the scholarship team for verification.',
          time: 'Just now',
          read: false,
        },
        ...current.notifications,
      ],
    }));
  }catch (error) {
    console.error("Final submit error:", error);
    alert("An error accoured while file submitting the profile; ", + error.message);
  }
}


const loadRealUserProfile = async () =>{

  // pick up the token for the localstorage
  const token = localStorage.getItem('scholarhub-auth-token') || localStorage.getItem('token');

  if(!token){
    console.warn("Token not avialable! Please login/signup then after you forword");
    return;
  }

  try {
      const response = await fetch("http://localhost:5000/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Pranjal ke auth middleware ko pass karne ke liye Bearer Token bheja
          "Authorization": token
        }
      });

      if (!response.ok) {
        throw new Error("Backend ne profile dene se mana kar diya.");
      }

      const dbUserData = await response.json();
      console.log(" MongoDB se Real User Data Aa Gaya:", dbUserData);

      // Global state ko backend ke real data se sync karo taaki dashboard dynamic ho jaye
      setState((current) => ({
        ...current,
        profile: {
          ...current.profile,
          // Agar database me naam hai toh wo dikhao, warna email ka prefix use kar lo
          name: dbUserData.name || dbUserData.fullName || dbUserData.email.split('@')[0],
          email: dbUserData.email,
        },
        personal: {
          ...current.personal,
          fullName: dbUserData.name || dbUserData.fullName || current.personal.fullName,
          state: dbUserData.state || current.personal.state,
          city: dbUserData.city || current.personal.city,
        }
      }));

    } catch (error) {
      console.error("Dashboard profile sync fail:", error);
    }
}

//To fetch real-time recommendation for logged-in users from a backend
const loadRecommendedScholarships = async () => {
    const token = localStorage.getItem('scholarhub-auth-token') || localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/scholarship/recommendations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(" Real Recommendations from DB:", data);
        
        setState((current) => ({
          ...current,
          // Agar database me data hai toh use array me set karo
          recommendedProgramsData: data 
        }));
      }
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    }
  };
//  2. Backend se Expiring Soon waali scholarships lana (Deadlines ke liye)
  const loadExpiringDeadlines = async () => {
    try {
      const response = await fetch("http://localhost:5000/scholarship/expiring-soon", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(" Real Deadlines from DB:", data);
        
        setState((current) => ({
          ...current,
          deadlineItemsData: data
        }));
      }
    } catch (error) {
      console.error("Failed to load deadlines:", error);
    }
  }


  const profileCompletion = calculateCompletion(state);
  const unreadNotifications = state.notifications.filter((notification) => !notification.read).length;
  const selectedProgram =
    programs.find((program) => program.id === state.selectedProgramId) ?? programs[0];

const value = {
    state,
    setAuthMode,
    applyRegistrationProfile,
    updateSection,
    toggleDeclaration,
    setSelectedProgram,
    markNotificationRead,
    markAllNotificationsRead,
    sendAssistantMessage,
    resetAssistantConversation,
    submitApplication,
    loadRecommendedScholarships, // 🔥 Exported
    loadExpiringDeadlines,
    loadRealUserProfile, // 🔥 FIX: Yeh line jod di taaki dashboard ise call kar sake!
    profileCompletion,
    unreadNotifications,
    selectedProgram,
    assistantQuickReplies,
    recommendedPrograms,
    deadlineItems,
    applicationItems,
    activityFeed,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
