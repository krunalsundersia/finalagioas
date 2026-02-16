import React, { useState, useEffect } from 'react';
import { 
  Check, X,
  User, FileText, UploadCloud,
  ChevronDown, Lock, Save, AlertTriangle,
  Database, Clock, Hexagon, MapPin, Target, TrendingUp, MessageSquare, Box, Briefcase, LayoutDashboard, Flag, Activity, Hourglass,
  // New Imports for Smart Qualification
  Rocket, Code, Globe, Users, DollarSign, BarChart, PieChart, ShieldCheck, Crown, Video, PhoneOff, Send
} from 'lucide-react';

// --- IMPORTING EXTERNAL MODES (ROUTING) ---
// Note: Ensure these files exist in your project at these exact paths
import Boardroom3D from '../Vr/boardroom';             
import BoardroomChat from '../chat/boardroomchat';         


// ==========================================
// 1. SMART QUALIFICATION LOGIC (FULL)
// ==========================================
const getAdaptiveQuestions = (stage, valuation) => {
  const baseCategories = {
    // SCREENING QUESTIONS (Always shown first)
    screening: {
      id: 'screening',
      label: 'Initial Assessment',
      icon: Target,
      desc: 'Tell us where you are right now.',
      questions: [
        {
          id: 'company_stage',
          type: 'chips',
          label: 'What\'s your current situation?',
          required: true,
          options: [
            'Just an idea',
            'MVP built, no revenue',
            'Early revenue (<$100K ARR)',
            'Product-market fit ($100K-$1M ARR)',
            'Scaling fast ($1M+ ARR)',
            'Profitable & growing'
          ]
        },
        {
          id: 'expected_valuation',
          type: 'chips',
          label: 'Target/Current Valuation',
          required: true,
          options: ['<$1M', '$1-5M', '$5-10M', '$10-25M', '$25-50M', '$50M+']
        },
        {
          id: 'funding_goal',
          type: 'text',
          label: 'How much are you raising (or have raised)?',
          placeholder: 'e.g., $500K, $2M, etc.',
          required: true
        }
      ]
    },

    // IDENTITY - Always shown but varies by stage
    identity: {
      id: 'identity',
      label: '1. Identity',
      icon: Rocket,
      desc: 'Legal foundation and core mission.',
      questions: [
        { id: 'legal_entity', type: 'chips', label: 'Legal Entity', options: ['LLC', 'C-Corp', 'S-Corp', 'Not Incorporated'] },
        { id: 'incorporation_date', type: 'text', label: 'Date of Incorporation', placeholder: 'MM/YYYY' },
        { id: 'hq_location', type: 'text', label: 'HQ Location', placeholder: 'City, State/Country' },
        { id: 'mission', type: 'text', label: 'Company Mission', placeholder: 'To organize the world\'s information...' },
        { id: 'num_founders', type: 'chips', label: 'Number of Co-founders', options: ['1 (Solo)', '2', '3', '4+'] }
      ]
    },

    // PRODUCT - Varies significantly by stage
    product: {
      id: 'product',
      label: '2. Product & Tech',
      icon: Code,
      desc: 'Stack, stage, and technical maturity.',
      questions: [
        { id: 'prod_type', type: 'chips', label: 'Product Type', options: ['SaaS', 'Mobile App', 'Marketplace', 'Hardware', 'B2B Software', 'Consumer'] },
        { id: 'product_stage', type: 'chips', label: 'Product Development Stage', options: ['Concept', 'Wireframes', 'MVP', 'Beta', 'General Availability', 'Scaling'] },
        { id: 'completeness', type: 'slider', label: 'Product Completeness (%)', min: '0%', max: '100%' },
        ...(stage !== 'Just an idea' ? [
          { id: 'tech_stack', type: 'checkbox_group', label: 'Tech Stack (Select all that apply)', options: ['React/Vue/Angular', 'Python/Django', 'Node.js', 'Ruby on Rails', 'AWS', 'GCP', 'Azure', 'PostgreSQL', 'MongoDB', 'Custom'] },
          { id: 'platform', type: 'chips', label: 'Platform', options: ['Web only', 'Mobile only', 'Both Web + Mobile', 'API/Backend'] },
          { id: 'ip_patents', type: 'chips', label: 'IP/Patents', options: ['None', 'Patent Pending', 'Granted Patents', 'Trade Secrets'] }
        ] : [])
      ]
    }
  };

  // CONDITIONAL CATEGORIES BASED ON STAGE
  const conditionalCategories = {};

  // --- STAGE: JUST AN IDEA ---
  if (stage === 'Just an idea') {
    conditionalCategories.market = {
      id: 'market',
      label: '3. Market',
      icon: Globe,
      desc: 'TAM and positioning.',
      questions: [
        { id: 'tam', type: 'chips', label: 'Total Addressable Market (TAM)', options: ['<$100M', '$100M-$500M', '$500M-$1B', '$1B-$5B', '$5B+'] },
        { id: 'target_customer', type: 'text', label: 'Who is your ideal customer?', placeholder: 'e.g., SMB owners, Enterprise IT teams' },
        { id: 'problem_statement', type: 'text', label: 'What problem are you solving?', placeholder: 'Describe the pain point...' }
      ]
    };

    conditionalCategories.team = {
      id: 'team',
      label: '4. Team',
      icon: Users,
      desc: 'Founder backgrounds.',
      questions: [
        { id: 'founder_background', type: 'text', label: 'Founder Background(s)', placeholder: 'Previous companies, roles, exits...' },
        { id: 'technical_cofounder', type: 'chips', label: 'Do you have a technical co-founder?', options: ['Yes', 'No', 'I am technical'] }
      ]
    };
  }

  // --- STAGE: MVP BUILT, NO REVENUE ---
  if (stage === 'MVP built, no revenue') {
    conditionalCategories.finance = {
      id: 'finance',
      label: '3. Financials',
      icon: DollarSign,
      desc: 'Early funding and burn.',
      questions: [
        { id: 'money_spent', type: 'text', label: 'Money spent to date', placeholder: '$50K' },
        { id: 'cash_balance_exact', type: 'text', label: 'Exact Cash Balance (Today)', placeholder: '$100,000' },
        { id: 'gross_burn_monthly', type: 'text', label: 'Gross Burn Monthly', placeholder: '$15,000' },
        { id: 'net_burn_monthly', type: 'text', label: 'Net Burn Monthly', placeholder: '$15,000' },
        { id: 'runway_computed_check', type: 'chips', label: 'Is runway calculated by system?', options: ['Yes', 'No (Manual Estimate)'] },
        { id: 'runway_months', type: 'text', label: 'Runway (months)', placeholder: 'Auto-calculated or manual' },
        { id: 'funding_raised', type: 'text', label: 'Funding raised to date', placeholder: '$0, $50K, $500K, etc.' }
      ]
    };
    conditionalCategories.metrics = {
      id: 'metrics',
      label: '4. Traction',
      icon: BarChart,
      desc: 'Early user metrics.',
      questions: [
        { id: 'beta_users', type: 'text', label: 'Beta users count', placeholder: '0-100' },
        { id: 'waitlist_size', type: 'text', label: 'Waitlist size', placeholder: '0' },
        { id: 'lois_count', type: 'text', label: 'Letters of Intent (LOIs)', placeholder: '0' },
        { id: 'pilot_customers', type: 'text', label: 'Pilot customers', placeholder: '0' }
      ]
    };
    conditionalCategories.market = {
      id: 'market',
      label: '5. Market',
      icon: Globe,
      desc: 'TAM, competitors.',
      questions: [
        { id: 'tam', type: 'chips', label: 'TAM', options: ['<$100M', '$100M-$500M', '$500M-$1B', '$1B-$5B', '$5B+'] },
        { id: 'competitors', type: 'text', label: 'Top 3 Competitors', placeholder: 'Competitor 1, Competitor 2, Competitor 3' },
        { id: 'differentiation', type: 'text', label: 'Your Key Differentiation', placeholder: 'What makes you different?' }
      ]
    };
    conditionalCategories.team = {
      id: 'team',
      label: '6. Team',
      icon: Users,
      desc: 'Team composition.',
      questions: [
        { id: 'team_size', type: 'chips', label: 'Total Team', options: ['Solo', '2', '3-5', '6-10', '11-20', '20+'] },
        { id: 'fulltime_founders', type: 'chips', label: 'Full-time founders?', options: ['All full-time', 'Mix of FT/PT', 'All part-time'] },
        { id: 'advisors', type: 'text', label: 'Advisors/Board Members', placeholder: 'Names or count' },
        { id: 'avg_cost_employee', type: 'text', label: 'Avg Cost Per Employee', placeholder: '$6k/mo' }
      ]
    };
  }

  // --- STAGE: EARLY REVENUE / SEED ---
  if (stage === 'Early revenue (<$100K ARR)' || stage === 'Product-market fit ($100K-$1M ARR)') {
    conditionalCategories.finance = {
      id: 'finance',
      label: '3. Financials',
      icon: DollarSign,
      desc: 'Revenue, burn, and unit economics.',
      questions: [
        { id: 'cash_balance_exact', type: 'text', label: 'Exact Cash Balance (Bank)', placeholder: '$500,000' },
        { id: 'gross_burn_monthly', type: 'text', label: 'Gross Burn Monthly', placeholder: '$40,000' },
        { id: 'net_burn_monthly', type: 'text', label: 'Net Burn Monthly', placeholder: '$25,000' },
        { id: 'runway_computed_check', type: 'chips', label: 'Is runway calculated by system?', options: ['Yes', 'No (Manual Estimate)'] },
        { id: 'mrr', type: 'text', label: 'Monthly Recurring Revenue (MRR)', placeholder: '$15,000' },
        { id: 'new_arr', type: 'text', label: 'New ARR (Last month)', placeholder: '$2,000' },
        { id: 'expansion_arr', type: 'text', label: 'Expansion ARR (Last month)', placeholder: '$500' },
        { id: 'churned_arr', type: 'text', label: 'Churned ARR (Last month)', placeholder: '$0' },
        { id: 'recurring_pct', type: 'text', label: '% Recurring Revenue', placeholder: '90%' },
        { id: 'services_pct', type: 'text', label: '% Services/One-time', placeholder: '10%' },
        { id: 'cac', type: 'text', label: 'CAC (Customer Acquisition Cost)', placeholder: '$500' },
        { id: 'ltv', type: 'text', label: 'LTV (Lifetime Value)', placeholder: '$2,000' },
        { id: 'payback_assumptions', type: 'text', label: 'Payback Period Assumptions', placeholder: 'Gross margin basis?' },
        { id: 'gross_margin', type: 'text', label: 'Gross Margin (%)', placeholder: '75%' },
        { id: 'opex_rd', type: 'text', label: 'R&D/Product Expenses', placeholder: '$8,000/mo' },
        { id: 'opex_sales', type: 'text', label: 'Sales & Marketing Expenses', placeholder: '$5,000/mo' },
        { id: 'opex_ga', type: 'text', label: 'G&A Expenses', placeholder: '$2,000/mo' },
        { id: 'total_raised', type: 'text', label: 'Total raised to date', placeholder: '$500K' },
        { id: 'data_source', type: 'chips', label: 'Data Source', options: ['Manual Entry', 'Deck Upload', 'Bank Sync', 'Accounting Software'] }
      ]
    };

    conditionalCategories.equity = {
      id: 'equity',
      label: '4. Cap Table & Equity',
      icon: PieChart,
      desc: 'Ownership breakdown.',
      questions: [
        { id: 'founder1_equity', type: 'text', label: 'Founder 1 Equity (%)', placeholder: '40%' },
        { id: 'founder1_vesting', type: 'text', label: 'Founder 1 Vesting Schedule', placeholder: '4-year vest, 1-year cliff' },
        { id: 'founder2_equity', type: 'text', label: 'Founder 2 Equity (%)', placeholder: '40%' },
        { id: 'founder2_vesting', type: 'text', label: 'Founder 2 Vesting Schedule', placeholder: '4-year vest, 1-year cliff' },
        { id: 'angel_equity', type: 'text', label: 'Angel Investors Equity (%)', placeholder: '15%' },
        { id: 'vc_equity', type: 'text', label: 'VC Equity (%)', placeholder: '0% or 5%' },
        { id: 'esop_reserved', type: 'text', label: 'ESOP Reserved (%)', placeholder: '10%' },
        { id: 'esop_allocated', type: 'text', label: 'ESOP Allocated (%)', placeholder: '3%' },
        { id: 'safes_outstanding', type: 'text', label: 'SAFEs/Convertible Notes Outstanding', placeholder: '$100K at $5M cap' }
      ]
    };

    conditionalCategories.metrics = {
      id: 'metrics',
      label: '5. Metrics & Retention',
      icon: BarChart,
      desc: 'Retention, churn, and concentration.',
      questions: [
        { id: 'logo_churn_pct', type: 'text', label: 'Logo Churn % (Monthly)', placeholder: '2%' },
        { id: 'revenue_churn_pct', type: 'text', label: 'Gross Revenue Churn %', placeholder: '1.5%' },
        { id: 'nrr', type: 'text', label: 'Net Revenue Retention (NRR %)', placeholder: '105%' },
        { id: 'grr', type: 'text', label: 'Gross Revenue Retention (GRR %)', placeholder: '90%' },
        { id: 'concentration_top_1', type: 'text', label: 'Top 1 Customer % Rev', placeholder: '15%' },
        { id: 'concentration_top_5', type: 'text', label: 'Top 5 Customers % Rev', placeholder: '40%' },
        { id: 'concentration_top_10', type: 'text', label: 'Top 10 Customers % Rev', placeholder: '60%' },
        { id: 'total_signups', type: 'text', label: 'Total signups', placeholder: '500' },
        { id: 'dau_mau_ratio', type: 'text', label: 'DAU/MAU Ratio (Stickiness %)', placeholder: '30%' },
        { id: 'nps', type: 'text', label: 'NPS Score (-100 to +100)', placeholder: '40' }
      ]
    };

    conditionalCategories.sales = {
      id: 'sales',
      label: '6. Sales & Efficiency',
      icon: TrendingUp,
      desc: 'Sales process and channel efficiency.',
      questions: [
        { id: 'sales_model', type: 'chips', label: 'Sales Model', options: ['PLG (Product-Led)', 'Sales-Led', 'Hybrid', 'Self-Serve'] },
        { id: 'pipeline_value', type: 'text', label: 'Total Pipeline Value', placeholder: '$500,000' },
        { id: 'pipeline_coverage', type: 'text', label: 'Pipeline Coverage Ratio', placeholder: '3x quota' },
        { id: 'new_arr_30d', type: 'text', label: 'New ARR Added (Last 30 Days)', placeholder: '$15k' },
        { id: 'sales_efficiency_ratio', type: 'text', label: 'Sales Efficiency (New ARR / Sales Spend)', placeholder: '0.9' },
        { id: 'avg_sales_cycle', type: 'text', label: 'Average sales cycle (days)', placeholder: '30 days' },
        { id: 'win_rate', type: 'text', label: 'Win rate (%)', placeholder: '25%' },
        { id: 'avg_deal_size', type: 'text', label: 'Average deal size', placeholder: '$2,000' },
        { id: 'lead_sources', type: 'checkbox_group', label: 'Lead Sources', options: ['Organic/SEO', 'Paid Ads', 'Referrals', 'Events/Conferences', 'Outbound', 'Partnerships'] }
      ]
    };

    conditionalCategories.market = {
      id: 'market',
      label: '7. Market',
      icon: Globe,
      desc: 'TAM, competitors, positioning.',
      questions: [
        { id: 'tam', type: 'text', label: 'TAM (Total Addressable Market)', placeholder: '$5B' },
        { id: 'sam', type: 'text', label: 'SAM (Serviceable Available Market)', placeholder: '$500M' },
        { id: 'som', type: 'text', label: 'SOM (Serviceable Obtainable Market)', placeholder: '$50M' },
        { id: 'competitor_1', type: 'text', label: 'Competitor 1 (Name, Revenue, Users)', placeholder: 'CompanyX, $10M ARR, 50K users' },
        { id: 'competitor_2', type: 'text', label: 'Competitor 2', placeholder: 'CompanyY, $5M ARR, 20K users' },
        { id: 'differentiation', type: 'text', label: 'Your Differentiation', placeholder: '10x faster, AI-powered, etc.' },
        { id: 'moat', type: 'text', label: 'Moat/Defensibility', placeholder: 'Network effects, proprietary data, etc.' }
      ]
    };

    conditionalCategories.team = {
      id: 'team',
      label: '8. Team Economics',
      icon: Users,
      desc: 'Headcount cost structure.',
      questions: [
        { id: 'team_size', type: 'chips', label: 'Total Team', options: ['2-5', '6-10', '11-20', '21-50', '50+'] },
        { id: 'headcount_eng', type: 'text', label: 'Headcount: Engineering', placeholder: '3' },
        { id: 'headcount_sales', type: 'text', label: 'Headcount: Sales/Mktg', placeholder: '2' },
        { id: 'headcount_ga', type: 'text', label: 'Headcount: G&A', placeholder: '1' },
        { id: 'avg_cost_employee', type: 'text', label: 'Avg Cost Per Employee', placeholder: '$8k/mo' },
        { id: 'headcount_cost_monthly', type: 'text', label: 'Total Monthly Payroll', placeholder: '$48k' },
        { id: 'planned_hires', type: 'text', label: 'Planned Hires (Next 6 Mo)', placeholder: '2 Eng, 1 Sales' },
        { id: 'planned_hires_cost', type: 'text', label: 'Est. Cost of Planned Hires', placeholder: '$25k/mo' },
        { id: 'founder_backgrounds', type: 'text', label: 'Founder Backgrounds', placeholder: 'Ex-Google PM, Ex-Stripe Engineer, etc.' }
      ]
    };

    conditionalCategories.risks = {
      id: 'risks',
      label: '9. Risk Register',
      icon: AlertTriangle,
      desc: 'Ownership and mitigation.',
      questions: [
        { id: 'risk_market_desc', type: 'text', label: 'Top Market Risk Description', placeholder: 'Competitor price dumping...' },
        { id: 'risk_market_owner', type: 'text', label: 'Market Risk Owner', placeholder: 'CEO' },
        { id: 'risk_market_mitigation', type: 'text', label: 'Market Risk Mitigation Plan', placeholder: 'Lock in 2-year contracts...' },
        { id: 'risk_tech_desc', type: 'text', label: 'Top Technical Risk Description', placeholder: 'Scalability bottleneck...' },
        { id: 'risk_tech_owner', type: 'text', label: 'Technical Risk Owner', placeholder: 'CTO' },
        { id: 'risk_exec_desc', type: 'text', label: 'Top Execution Risk Description', placeholder: 'Hiring delays...' },
        { id: 'customer_concentration', type: 'text', label: 'Top customer % of revenue', placeholder: '15%' }
      ]
    };

    conditionalCategories.governance = {
      id: 'governance',
      label: '10. Governance',
      icon: ShieldCheck,
      desc: 'Board structure and oversight.',
      questions: [
        { id: 'board_members', type: 'text', label: 'Board Members (Names)', placeholder: 'Founder 1, Founder 2, VC Partner' },
        { id: 'board_observers', type: 'text', label: 'Board Observers', placeholder: 'Associate name...' },
        { id: 'meeting_freq', type: 'chips', label: 'Board Meeting Frequency', options: ['Monthly', 'Quarterly', 'Ad-hoc'] },
        { id: 'reserved_matters', type: 'text', label: 'Key Reserved Matters', placeholder: 'Debt >$50k, Hiring C-levels...' }
      ]
    };

    conditionalCategories.strategy = {
      id: 'strategy',
      label: '11. Strategy',
      icon: Target,
      desc: 'Exit, milestones, moat.',
      questions: [
        { id: 'exit', type: 'chips', label: 'Exit Goal', options: ['IPO', 'Acquisition', 'Long-term hold', 'Undecided'] },
        { id: 'milestones_12mo', type: 'text', label: '12-month Milestones', placeholder: 'Hit $1M ARR, Hire VP Sales, Launch Enterprise tier' },
        { id: 'next_fundraise', type: 'text', label: 'Next fundraise timeline & amount', placeholder: 'Series A in 12mo, $5M' }
      ]
    };
  }

  // --- STAGE: SCALING / SERIES A+ ---
  if (stage === 'Scaling fast ($1M+ ARR)' || stage === 'Profitable & growing') {
    conditionalCategories.finance = {
      id: 'finance',
      label: '3. Financials (Advanced)',
      icon: DollarSign,
      desc: 'Complete financial picture with unit economics.',
      questions: [
        { id: 'cash_balance_exact', type: 'text', label: 'Exact Cash Balance', placeholder: '$2,500,000' },
        { id: 'gross_burn_monthly', type: 'text', label: 'Gross Burn', placeholder: '$200,000' },
        { id: 'net_burn_monthly', type: 'text', label: 'Net Burn', placeholder: '$100,000' },
        { id: 'mrr_history_12m', type: 'text', label: 'MRR History (12 Months)', placeholder: 'Paste CSV...' },
        { id: 'burn_history_12m', type: 'text', label: 'Burn History (12 Months)', placeholder: 'Paste CSV...' },
        { id: 'forecast_revenue', type: 'text', label: 'Forecasted Revenue (Next 12 Mo)', placeholder: '$4M' },
        { id: 'forecast_expenses', type: 'text', label: 'Forecasted Expenses (Next 12 Mo)', placeholder: '$3M' },
        { id: 'forecast_burn', type: 'text', label: 'Forecasted Burn (Next 12 Mo)', placeholder: '$1.2M' },
        { id: 'forecast_cash_end', type: 'text', label: 'Forecasted Cash End of Year', placeholder: '$1.3M' },
        { id: 'downside_case_exists', type: 'chips', label: 'Has downside case been modeled?', options: ['Yes', 'No'] },
        { id: 'forecast_assumptions', type: 'text', label: 'Key Forecast Assumptions', placeholder: '3 sales hires in Q2...' },
        { id: 'arr', type: 'text', label: 'Annual Recurring Revenue (ARR)', placeholder: '$2M' },
        { id: 'mrr', type: 'text', label: 'Monthly Recurring Revenue (MRR)', placeholder: '$170K' },
        { id: 'revenue_last_month', type: 'text', label: 'Revenue last month', placeholder: '$170K' },
        { id: 'yoy_growth', type: 'text', label: 'YoY Growth Rate (%)', placeholder: '200%' },
        { id: 'qoq_growth', type: 'text', label: 'QoQ Growth Rate (%)', placeholder: '30%' },
        { id: 'ndr', type: 'text', label: 'Net Dollar Retention (NDR %)', placeholder: '110% (>100% ideal)' },
        { id: 'gdr', type: 'text', label: 'Gross Dollar Retention (GDR %)', placeholder: '95%' },
        { id: 'expansion_revenue', type: 'text', label: 'Expansion Revenue %', placeholder: '25%' },
        { id: 'cac', type: 'text', label: 'CAC (Blended)', placeholder: '$2,000' },
        { id: 'ltv', type: 'text', label: 'LTV (Lifetime Value)', placeholder: '$8,000' },
        { id: 'cac_ltv_ratio', type: 'text', label: 'CAC:LTV Ratio', placeholder: '1:4' },
        { id: 'payback_period', type: 'text', label: 'Payback Period (months)', placeholder: '10 months' },
        { id: 'magic_number', type: 'text', label: 'Magic Number (Sales Efficiency)', placeholder: '0.85 (>0.75 target)' },
        { id: 'gross_margin_overall', type: 'text', label: 'Overall Gross Margin (%)', placeholder: '75%' },
        { id: 'current_ebitda', type: 'text', label: 'Current EBITDA', placeholder: '-$50K/month' },
        { id: 'rule_of_40', type: 'text', label: 'Rule of 40 Score', placeholder: '35 (Growth % + Profit Margin %)' },
        { id: 'total_raised', type: 'text', label: 'Total raised to date', placeholder: '$3M' },
        { id: 'data_source', type: 'chips', label: 'Data Source', options: ['Manual', 'Sync', 'Verified'] }
      ]
    };

    conditionalCategories.equity = {
      id: 'equity',
      label: '4. Cap Table & Equity',
      icon: PieChart,
      desc: 'Complete ownership structure.',
      questions: [
        { id: 'founder_equity_breakdown', type: 'text', label: 'All Founders Equity Breakdown', placeholder: 'Founder A: 30%, Founder B: 25%, etc.' },
        { id: 'pro_rata_rights', type: 'text', label: 'Investors with Pro-Rata Rights', placeholder: 'List firms...' },
        { id: 'liquidation_preference', type: 'chips', label: 'Liquidation Preference', options: ['1x Non-Participating', '1x Participating', '>1x'] },
        { id: 'voting_rights', type: 'text', label: 'Key Voting Rights/Protective Provisions', placeholder: 'Veto on sale, new debt >$500k...' },
        { id: 'option_pool_size', type: 'text', label: 'Option Pool Size (Total %)', placeholder: '15%' },
        { id: 'option_pool_unallocated', type: 'text', label: 'Unallocated Option Pool %', placeholder: '8%' },
        { id: 'option_strike_price', type: 'text', label: 'Current 409A Strike Price', placeholder: '$0.45' },
        { id: 'vc_equity_total', type: 'text', label: 'Total VC Equity (%)', placeholder: '35%' },
        { id: 'vc_firms', type: 'text', label: 'Which VC Firms?', placeholder: 'Sequoia 20%, a16z 15%' },
        { id: 'angel_equity', type: 'text', label: 'Angel Equity (%)', placeholder: '5%' },
        { id: 'esop_allocated', type: 'text', label: 'ESOP Allocated (%)', placeholder: '8%' },
        { id: 'fully_diluted_shares', type: 'text', label: 'Fully Diluted Shares Outstanding', placeholder: '10,000,000' },
        { id: 'preferred_shares', type: 'text', label: 'Preferred Shares', placeholder: '3,500,000' },
        { id: 'common_shares', type: 'text', label: 'Common Shares', placeholder: '6,500,000' }
      ]
    };

    conditionalCategories.metrics = {
      id: 'metrics',
      label: '5. Metrics & Retention',
      icon: BarChart,
      desc: 'Deep dive retention and cohorts.',
      questions: [
        { id: 'nrr', type: 'text', label: 'Net Revenue Retention (NRR)', placeholder: '110%' },
        { id: 'grr', type: 'text', label: 'Gross Revenue Retention (GRR)', placeholder: '90%' },
        { id: 'logo_churn', type: 'text', label: 'Logo Churn (Monthly)', placeholder: '1%' },
        { id: 'concentration_top_10', type: 'text', label: 'Top 10 Customers % Rev', placeholder: '40%' },
        { id: 'cohort_retention_12m', type: 'text', label: '12-Month Cohort Retention %', placeholder: '80%' }
      ]
    };

    conditionalCategories.sales = {
      id: 'sales',
      label: '6. Sales & Efficiency',
      icon: TrendingUp,
      desc: 'Pipeline health and efficiency.',
      questions: [
        { id: 'cac_breakdown', type: 'text', label: 'CAC by Channel (Paid/Organic/Referral)', placeholder: '$500 / $50 / $0' },
        { id: 'marketing_channels', type: 'text', label: 'Top 3 Marketing Channels', placeholder: 'LinkedIn Ads, SEO, Events' },
        { id: 'sales_rep_quota', type: 'text', label: 'Avg Quota Attainment %', placeholder: '75%' },
        { id: 'pipeline_stages', type: 'text', label: 'Pipeline Conversion Rates (Stage-by-Stage)', placeholder: '20% Lead->Opp, 30% Opp->Close' },
        { id: 'unit_economics_segment', type: 'text', label: 'LTV:CAC by Segment (SMB vs Ent)', placeholder: 'SMB 3:1, Ent 5:1' },
        { id: 'pipeline_coverage', type: 'text', label: 'Pipeline Coverage Ratio', placeholder: '3.5x' },
        { id: 'sales_efficiency_ratio', type: 'text', label: 'Sales Efficiency Ratio', placeholder: '0.9' },
        { id: 'win_rate', type: 'text', label: 'Win Rate (%)', placeholder: '25%' },
        { id: 'acv', type: 'text', label: 'Average Contract Value (ACV)', placeholder: '$25,000' },
        { id: 'sales_rep_ramp', type: 'text', label: 'Rep Ramp Time (months)', placeholder: '4' }
      ]
    };

    conditionalCategories.product = {
      id: 'product',
      label: '7. Product Strategy',
      icon: Code,
      desc: 'Roadmap and validation.',
      questions: [
        { id: 'roadmap_allocation', type: 'text', label: 'Eng Allocation (New Features vs Maint)', placeholder: '60% New / 40% Maint' },
        { id: 'top_feature_requests', type: 'text', label: 'Top 3 Customer Feature Requests', placeholder: 'SSO, API access, Mobile app' },
        { id: 'key_partnerships', type: 'text', label: 'Strategic Partnerships / Dependencies', placeholder: 'Salesforce AppExchange, AWS Marketplace' },
        { id: 'product_moat', type: 'text', label: 'Technical Moat', placeholder: 'Proprietary AI model...' }
      ]
    };

    conditionalCategories.team = {
      id: 'team',
      label: '8. Team Economics',
      icon: Users,
      desc: 'Headcount cost structure.',
      questions: [
        { id: 'founder_salaries', type: 'text', label: 'Founder Salaries (Annual)', placeholder: '$150k each' },
        { id: 'key_person_insurance', type: 'chips', label: 'Key Person Insurance?', options: ['Yes', 'No', 'Planned'] },
        { id: 'headcount', type: 'text', label: 'Total Headcount', placeholder: '45' },
        { id: 'headcount_by_dept', type: 'text', label: 'Headcount by Dept (Eng/Sales/Mkt/G&A)', placeholder: '20/15/5/5' },
        { id: 'avg_cost_employee', type: 'text', label: 'Avg Cost Per Employee', placeholder: '$10k/mo' },
        { id: 'exec_team', type: 'checkbox_group', label: 'Execs Hired', options: ['VP Sales', 'VP Eng', 'VP Mktg', 'CFO', 'CPO'] }
      ]
    };

    conditionalCategories.risks = {
      id: 'risks',
      label: '9. Risk Register',
      icon: AlertTriangle,
      desc: 'Detailed risk log.',
      questions: [
        { id: 'risk_1_detail', type: 'text', label: 'Top Risk 1 (Desc, Owner, Mitigation)', placeholder: '...' },
        { id: 'risk_2_detail', type: 'text', label: 'Top Risk 2 (Desc, Owner, Mitigation)', placeholder: '...' },
        { id: 'risk_3_detail', type: 'text', label: 'Top Risk 3 (Desc, Owner, Mitigation)', placeholder: '...' }
      ]
    };

    conditionalCategories.governance = {
      id: 'governance',
      label: '10. Governance',
      icon: ShieldCheck,
      desc: 'Board structure.',
      questions: [
        { id: 'board_composition', type: 'text', label: 'Board Composition', placeholder: '2 Founders, 2 VC, 1 Independent' },
        { id: 'meeting_freq', type: 'chips', label: 'Meeting Frequency', options: ['Monthly', 'Quarterly'] },
        { id: 'observers', type: 'text', label: 'Observers', placeholder: 'Names...' }
      ]
    };

    conditionalCategories.strategy = {
      id: 'strategy',
      label: '11. Strategy',
      icon: Target,
      desc: 'Moat and Exit.',
      questions: [
        { id: 'moat', type: 'text', label: 'Defensibility', placeholder: 'Network effects...' },
        { id: 'expansion_plans', type: 'text', label: 'Expansion Plans', placeholder: 'New Geo/Product' },
        { id: 'exit_strategy', type: 'chips', label: 'Exit Goal', options: ['IPO', 'M&A', 'Hold'] }
      ]
    };
  }
  
  return { ...baseCategories, ...conditionalCategories };
};

// ==========================================
// 3. MAIN COMPONENT (State & Routing)
// ==========================================

const BoardRoom = ({ activeSim, onBack }) => {
  // STATE FOR INTERNAL ROUTING (Setup, 3D, Chat, Video)
  const [currentView, setCurrentView] = useState('setup');
  const [meetingConfig, setMeetingConfig] = useState(null);
  
  // CONFIG STATE
  const [config, setConfig] = useState({
    title: "C-Suite Immersion Consultancy", 
    agendaText: "", 
    meetingAim: "", 
    discussionHorizon: "Strategic (Long-Term)", 
    companyHealth: "Stable Growth", 
    meetingType: "Quarterly Review",
    companyStage: "Growth (Series B+)",
    strategicFocus: "Path to Profitability",
    meetingMode: "3d", // '3d', 'chat', or 'video'
    useAssets: true, 
  });

  const [instructionsChecked, setInstructionsChecked] = useState(false);
  const [history, setHistory] = useState([]); 
  const [unsavedCharChanges, setUnsavedCharChanges] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [adaptiveData, setAdaptiveData] = useState({});
  const [activeCategory, setActiveCategory] = useState('screening');
  
  // DEFAULT CHARACTERS
  const [characters, setCharacters] = useState([
    { id: 1, name: "Evelyn S.", role: "Chairperson", initials: "ES", color: "#5D4037", behaviors: [ { id: 'b1', name: "Governance", val: 99 }, { id: 'b2', name: "Accountability", val: 95 } ] },
    { id: 2, name: "David R.", role: "CEO (Internal)", initials: "DR", color: "#2E3B4E", behaviors: [ { id: 'b1', name: "Vision Articulation", val: 95 }, { id: 'b2', name: "Execution", val: 90 } ] },
    { id: 3, name: "Rajiv K.", role: "Lead Investor", initials: "RK", color: "#3E4F5E", behaviors: [ { id: 'b1', name: "Financial Metrics", val: 95 }, { id: 'b2', name: "Burn Rate", val: 90 } ] },
    { id: 4, name: "Elena M.", role: "CFO (Internal)", initials: "EM", color: "#2E3B4E", behaviors: [ { id: 'b1', name: "Audit & Risk", val: 99 }, { id: 'b2', name: "Forecasting", val: 95 } ] },
    { id: 5, name: "Dr. Alistair C.", role: "Independent Director", initials: "AC", color: "#4A5D4A", behaviors: [ { id: 'b1', name: "ESG & Ethics", val: 95 }, { id: 'b2', name: "Conflict Resolution", val: 80 } ] },
    { id: 6, name: "Sarah L.", role: "Industry Veteran", initials: "SL", color: "#6D5C40", behaviors: [ { id: 'b1', name: "Product-Market Fit", val: 95 }, { id: 'b2', name: "Talent Strategy", val: 80 } ] },
    { id: 7, name: "James B.", role: "Legal Counsel", initials: "JB", color: "#582C2C", behaviors: [ { id: 'b1', name: "Regulatory Compliance", val: 99 }, { id: 'b2', name: "IP Protection", val: 90 } ] },
    { id: 8, name: "Fiona W.", role: "Talent & Comp Chair", initials: "FW", color: "#6D4C41", behaviors: [ { id: 'b1', name: "Compensation Structure", val: 95 }, { id: 'b2', name: "Retention", val: 85 } ] },
    { id: 9, name: "Michael T.", role: "Board Observer", initials: "MT", color: "#455A64", behaviors: [ { id: 'b1', name: "Operational Execution", val: 90 }, { id: 'b2', name: "GTM Efficiency", val: 85 } ] }
  ]);
  const [expandedChar, setExpandedChar] = useState(1); 

  // GENERATE DYNAMIC QUESTIONS
  const generatedQuestions = getAdaptiveQuestions(adaptiveData.company_stage || 'Just an idea', adaptiveData.expected_valuation);

  useEffect(() => {
    const savedConfig = localStorage.getItem('asklurk_board_config');
    if (savedConfig) {
        try { setConfig(prev => ({ ...prev, ...JSON.parse(savedConfig) })); } catch (e) {}
    }
    const savedChars = localStorage.getItem('asklurk_board_chars');
    if (savedChars) {
      try { setCharacters(JSON.parse(savedChars)); } catch (e) {}
    }
    const generateToken = () => {
      const array = new Uint32Array(8);
      window.crypto.getRandomValues(array);
      let token = "";
      for (let i = 0; i < array.length; i++) token += array[i].toString(16);
      return token;
    };
    setCsrfToken(generateToken());
  }, []);

  useEffect(() => {
    localStorage.setItem('asklurk_board_config', JSON.stringify(config));
  }, [config]);

  const handleAdaptiveChange = (id, value) => {
    setAdaptiveData(prev => ({ ...prev, [id]: value }));
  };

  const handleBehaviorChange = (charId, behaviorId, newVal) => {
    setUnsavedCharChanges(true);
    setCharacters(prev => prev.map(c => {
      if (c.id !== charId) return c;
      return { ...c, behaviors: c.behaviors.map(b => b.id === behaviorId ? { ...b, val: newVal } : b) };
    }));
  };

  const handleSaveCharacters = (e) => {
    e.stopPropagation();
    localStorage.setItem('asklurk_board_chars', JSON.stringify(characters));
    setUnsavedCharChanges(false);
    alert("Board configuration saved.");
  };

  const status = {
    agenda: config.agendaText.trim().length > 0,
    aim: config.meetingAim.trim().length > 0,
    health: config.companyHealth !== "",
    assets: config.useAssets, 
    target: config.meetingType && config.companyStage && config.strategicFocus,
    adjustment: true, 
    directives: instructionsChecked
  };

  const completionPercent = Math.round(
    (Object.values(status).filter(Boolean).length / Object.keys(status).length) * 100
  );
const handleStart = () => {
    const missing = [];
    if (!status.aim) missing.push("Meeting Aim");
    if (!status.agenda) missing.push("Agenda Narrative");
    if (!status.directives) missing.push("Directives Acknowledgment");

    if (missing.length > 0) {
      alert(`INITIATION HALTED.\n\nMissing: ${missing.join(', ')}`);
      return;
    }
    
    // ✅ BUILD COMPLETE COMPANY CONTEXT
    const companyContext = {
        // Meeting Setup
        title: config.title,
        meetingAim: config.meetingAim,
        agendaText: config.agendaText,
        meetingType: config.meetingType,
        companyStage: config.companyStage,
        strategicFocus: config.strategicFocus,
        companyHealth: config.companyHealth,
        discussionHorizon: config.discussionHorizon,
        meetingMode: config.meetingMode,
        
        // Smart Qualification Data (ALL OF IT!)
        adaptiveData: adaptiveData,
        
        // Board Composition
        boardMembers: characters.map(c => ({
            name: c.name,
            role: c.role,
            initials: c.initials,
            behaviors: c.behaviors
        })),
        
        // Session metadata
        csrfToken: csrfToken,
        sessionId: Date.now(),
        timestamp: new Date().toISOString()
    };
    
    console.log('📊 Company Context Being Sent:', companyContext);
    
    // Save session WITH complete context
    const newSession = { 
        id: Date.now(), 
        title: config.title,
        securityToken: csrfToken,
        config: config,
        context: companyContext  // ← IMPORTANT: Include full context
    };
    
    setHistory(prev => [newSession, ...prev]);
    setMeetingConfig(newSession);

    // Route to appropriate view
    if (config.meetingMode === '3d') {
      setCurrentView('3d');
    } else {
      setCurrentView('chat');
    }
};


// 2. UPDATE the routing at the bottom (around line 1000)
// Make sure config is passed to BoardroomChat
if (currentView === 'chat') {
    return <BoardroomChat config={meetingConfig} onBack={handleBackToSetup} />;
}

if (currentView === '3d') {
    return <Boardroom3D config={meetingConfig} onBack={handleBackToSetup} />;
}


  function handleBackToSetup() {
    setCurrentView('setup');
  };

  // ==========================================
  // RENDER: VIEW SWITCHER
  // ==========================================

  // CONDITIONAL RENDERING using Imported Components
  if (currentView === '3d') {
    return <Boardroom3D config={meetingConfig} onBack={handleBackToSetup} />;
  }

  if (currentView === 'chat') {
    return <BoardroomChat config={meetingConfig} onBack={handleBackToSetup} />;
  }

  
  const styles = {
    sectionTitle: { color: '#b27b1d', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16, marginTop: 32 },
    input: { width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(196, 168, 111, 0.25)', color: '#E8E0D5', padding: '12px', borderRadius: 4, outline: 'none', fontSize: 14, transition: 'all 0.3s ease' },
    select: { width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(196, 168, 111, 0.25)', color: '#E8E0D5', padding: '12px', borderRadius: 4, outline: 'none', fontSize: 13, cursor: 'pointer', appearance: 'none' },
    label: { color: '#9C8C74', fontSize: 13, marginBottom: 8, display: 'block' },
    card: { background: 'rgba(26, 18, 14, 0.6)', border: '1px solid rgba(196, 168, 111, 0.15)', borderRadius: 6, padding: 20, transition: 'all 0.3s ease', boxSizing: 'border-box' },
    goldBtn: { 
        background: completionPercent === 100 ? 'linear-gradient(135deg, #c2882b 0%, #c18f2d 50%, #c99136 100%)' : '#3E2F26', 
        color: completionPercent === 100 ? '#1A120E' : '#5E4F40', 
        border: 'none', borderRadius: 2, height: 40, padding: '0 32px', 
        fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', 
        cursor: completionPercent === 100 ? 'pointer' : 'not-allowed', 
        display: 'flex', alignItems: 'center', gap: 8, 
        boxShadow: completionPercent === 100 ? '0 0 15px rgba(212, 175, 104, 0.15)' : 'none', 
        transition: 'all 0.3s ease' 
    },
    saveBtn: {
        background: 'rgba(212, 175, 104, 0.1)', border: '1px solid #D4AF68', color: '#D4AF68',
        borderRadius: 2, padding: '4px 12px', fontSize: 10, fontWeight: 700,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        textTransform: 'uppercase', letterSpacing: '0.05em'
    },
    textArea: { width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(196, 168, 111, 0.25)', color: '#E8E0D5', padding: '12px', borderRadius: 4, outline: 'none', fontSize: 14, minHeight: 100, resize: 'none', fontFamily: 'var(--font-body)', transition: 'border-color 0.3s ease' }
  };

  const instructions = [
    "Board session duration is strictly capped at sixty (60) minutes.",
    "User allocation is limited to five (5) high-fidelity simulations per calendar month.",
    "Participant must register at least one substantive response every five (5) minutes.",
    "Interaction volume is capped at 500 distinct message units.",
    "Strategic 'skip' actions are restricted to a maximum of three (3) instances per session.",
    "The interface includes real-time analytical telemetry for performance monitoring.",
    "All discourse must adhere to strict fiduciary and professional standards.",
    "Active engagement with Director inquiries is mandatory.",
    "Navigating away from the active interface will trigger an automatic pause protocol.",
    "Session conclusion occurs automatically upon Resolution Adoption or Adjournment."
  ];

  const CompletionCircle = ({ percentage }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    return (
      <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="32" cy="32" r={radius} stroke="#3E2F26" strokeWidth="4" fill="transparent" />
          <circle cx="32" cy="32" r={radius} stroke={percentage === 100 ? "#5D7A58" : "#D4AF68"} strokeWidth="4" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: percentage === 100 ? "#5D7A58" : "#D4AF68" }}>{percentage}%</div>
        </div>
      </div>
    );
  };

  const ModeOption = ({ mode, icon: Icon, label }) => {
    const isSelected = config.meetingMode === mode;
    return (
        <div 
            onClick={() => setConfig({...config, meetingMode: mode})}
            style={{ 
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 12, borderRadius: 4, cursor: 'pointer',
                background: isSelected ? 'rgba(212, 175, 104, 0.1)' : 'transparent',
                border: `1px solid ${isSelected ? '#D4AF68' : 'rgba(255,255,255,0.1)'}`,
                transition: 'all 0.2s'
            }}
        >
            <Icon size={18} color={isSelected ? '#D4AF68' : '#9C8C74'} />
            <span style={{ fontSize: 11, color: isSelected ? '#E8E0D5' : '#9C8C74', fontWeight: isSelected ? 600 : 400 }}>{label}</span>
        </div>
    );
  };

  const StatusItem = ({ label, isReady }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#9C8C74', padding: '4px 0' }}>
        <span>{label}</span>
        {isReady ? <Check size={14} color="#5D7A58" /> : <X size={14} color="#8A3A3A" />}
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0F0A08', zIndex: 60, display: 'flex' }} className="fade-in">
      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1A120E; }
        ::-webkit-scrollbar-thumb { background: #3E2F26; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #D4AF68; }
        .char-card { transition: background 0.3s ease, border-color 0.3s ease; }
        .char-card:hover { border-color: rgba(212, 175, 104, 0.4); }
        .expand-enter { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .btn-hover:hover { transform: translateY(-1px); filter: brightness(1.1); }
        .btn-hover:active { transform: translateY(1px); filter: brightness(0.95); }
        .interactive-row:hover { background: rgba(255,255,255,0.03); }
        .instruction-item { display: flex; gap: 12px; margin-bottom: 12px; font-size: 13px; color: #9C8C74; line-height: 1.5; align-items: flex-start; }
        .instruction-num { color: #D4AF68; font-weight: 700; min-width: 20px; }
        .file-upload-zone { 
            width: 100%; box-sizing: border-box; 
            border: 1px dashed #5E4F40; background: rgba(255,255,255,0.02); 
            border-radius: 4px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; 
        }
        .file-upload-zone:hover { border-color: #D4AF68; background: rgba(212, 175, 104, 0.05); }
        select option { background: #1A120E; color: #E8E0D5; }
        .avatar-circle {
            width: 36px; height: 36px; border-radius: 50%;
            display: flex; alignItems: center; justifyContent: center;
            font-size: 13px; font-weight: 700; color: #E8E0D5;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .logo-tag {
            background: rgba(212, 175, 104, 0.15);
            border: 1px solid #D4AF68;
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 9px;
            font-weight: 700;
            color: #D4AF68;
            letter-spacing: 0.05em;
            margin-right: 8px;
        }
      `}</style>

      {/* --- LEFT SIDEBAR --- */}
      <div style={{ width: 220, background: '#1A120E', borderRight: '1px solid rgba(196, 168, 111, 0.25)', padding: '40px 20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* BRAND LABEL */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40, color: '#D4AF68', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span className="logo-tag">BETA</span>
            AGIOAS
        </div>
        
        <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, margin: '4px 0', color: '#E8E0D5', fontFamily: 'serif' }}>Initialization</h2>
            <div style={{ fontSize: 13, color: '#9C8C74' }}>Simulation Setup</div>
        </div>

        {/* COMPLETION CIRCLE */}
        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
            <CompletionCircle percentage={completionPercent} />
            <div>
                <div style={{ fontSize: 12, color: '#9C8C74', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Readiness</div>
                <div style={{ fontSize: 13, color: '#E8E0D5' }}>{completionPercent === 100 ? 'Authorized' : 'Pending'}</div>
            </div>
        </div>

        {/* PREVIOUS SESSIONS */}
        <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8F7045', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Session Logs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {history.length > 0 ? (
                    history.map((h) => (
                        <div key={h.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Clock size={12} color="#5E4F40" />
                            <span style={{ fontSize: 12, color: '#9C8C74' }}>{h.title}</span>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '8px 0', fontSize: 12, color: '#5E4F40', fontStyle: 'italic' }}>No archival data</div>
                )}
            </div>
        </div>

        {/* STATUS CHECKLIST */}
        <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8F7045', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>System Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <StatusItem label="Primary Objective" isReady={status.aim} />
                <StatusItem label="Executive Summary" isReady={status.agenda} />
                <StatusItem label="Board Pack" isReady={status.assets} />
                <StatusItem label="Gov. Profile" isReady={status.target} />
                <StatusItem label="Director Alignment" isReady={status.adjustment} />
                <StatusItem label="Directives Ack." isReady={status.directives} />
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <label style={styles.label}>MEETING IDENTIFIER</label>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                <input 
                    style={{ ...styles.input, fontSize: 32, fontFamily: 'serif', height: 70, background: 'transparent', borderBottom: '1px solid #D4AF68', borderTop: 0, borderLeft: 0, borderRight: 0, paddingLeft: 0, textAlign: 'center', paddingRight: 0 }} 
                    value={config.title} 
                    onChange={(e) => setConfig({...config, title: e.target.value})}
                    placeholder="Enter Meeting Title..."
                />
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 40 }}>
            
            {/* LEFT COLUMN */}
            <div>
                {/* PRIMARY OBJECTIVE */}
                <div style={styles.sectionTitle}>Primary Objective</div>
                <div style={{ marginBottom: 32 }}>
                    <label style={styles.label}>DEFINED MEETING AIM</label>
                    <input 
                        style={styles.input} 
                        placeholder="E.g. Approve FY25 Budget and Strategy..."
                        value={config.meetingAim}
                        onChange={(e) => setConfig({...config, meetingAim: e.target.value})}
                    />
                </div>

                {/* AGENDA NARRATIVE */}
                <div style={styles.sectionTitle}>Executive Summary & Agenda</div>
                <div style={{ marginBottom: 32 }}>
                    <label style={styles.label}>STRATEGIC UPDATE NARRATIVE</label>
                    <textarea 
                        style={styles.textArea} 
                        placeholder="Outline key discussion points..."
                        value={config.agendaText}
                        onChange={(e) => setConfig({...config, agendaText: e.target.value})}
                    />
                </div>

                {/* SMART QUALIFICATION */}
                <div style={styles.sectionTitle}>Smart Qualification</div>
                <div style={{ ...styles.card, padding: 0, overflow: 'hidden', marginBottom: 32, display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
                    <div style={{ width: 220, background: 'rgba(0,0,0,0.2)', borderRight: '1px solid rgba(196, 168, 111, 0.15)', padding: '20px 0' }}>
                        {Object.values(generatedQuestions).map((cat) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <div 
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    style={{ 
                                        padding: '12px 20px', cursor: 'pointer', borderLeft: `3px solid ${isActive ? '#D4AF68' : 'transparent'}`,
                                        background: isActive ? 'rgba(212, 175, 104, 0.05)' : 'transparent', display: 'flex', alignItems: 'center', gap: 10,
                                        color: isActive ? '#E8E0D5' : '#9C8C74', transition: 'all 0.2s'
                                    }}
                                >
                                    <cat.icon size={16} />
                                    <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}>{cat.label}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ flex: 1, padding: 30 }}>
                        {Object.values(generatedQuestions).map((cat) => {
                            if (activeCategory !== cat.id) return null;
                            return (
                                <div key={cat.id} className="fade-in">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, borderBottom: '1px solid rgba(196, 168, 111, 0.15)', paddingBottom: 16 }}>
                                        <div style={{ width: 40, height: 40, background: 'rgba(212, 175, 104, 0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(212, 175, 104, 0.2)' }}>
                                            <cat.icon size={20} color="#D4AF68" />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: 18, color: '#E8E0D5', fontFamily: 'serif' }}>{cat.label.toUpperCase()}</h3>
                                            <div style={{ fontSize: 13, color: '#9C8C74', marginTop: 4 }}>{cat.desc}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gap: 24 }}>
                                        {cat.questions.map((q, i) => (
                                            <div key={q.id + i}>
                                                <label style={{ ...styles.label, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: '#D4AF68' }}>{q.label.toUpperCase()}</label>
                                                {q.type === 'text' && (
                                                    <input style={{ ...styles.input, background: 'rgba(0,0,0,0.2)', fontSize: 13 }} placeholder={q.placeholder} value={adaptiveData[q.id] || ''} onChange={(e) => handleAdaptiveChange(q.id, e.target.value)} />
                                                )}
                                                {q.type === 'chips' && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                        {q.options.map((opt) => {
                                                            const isSelected = adaptiveData[q.id] === opt;
                                                            return (
                                                                <div key={opt} onClick={() => handleAdaptiveChange(q.id, opt)} style={{ padding: '8px 16px', borderRadius: 4, fontSize: 12, cursor: 'pointer', border: `1px solid ${isSelected ? '#D4AF68' : 'rgba(255,255,255,0.1)'}`, background: isSelected ? '#D4AF68' : 'rgba(255,255,255,0.05)', color: isSelected ? '#1A120E' : '#9C8C74', fontWeight: isSelected ? 700 : 400 }}>{opt}</div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                                {q.type === 'slider' && (
                                                    <input type="range" min="0" max="100" style={{ width: '100%', accentColor: '#D4AF68', height: 4, background: 'rgba(255,255,255,0.1)', appearance: 'auto' }} value={parseInt(adaptiveData[q.id] || 0)} onChange={(e) => handleAdaptiveChange(q.id, e.target.value + '%')} />
                                                )}
                                                {q.type === 'checkbox_group' && (
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                                        {q.options.map((opt) => {
                                                            const selected = (adaptiveData[q.id] || []).includes(opt);
                                                            return (
                                                                <div key={opt} onClick={() => { const current = adaptiveData[q.id] || []; handleAdaptiveChange(q.id, selected ? current.filter(x => x !== opt) : [...current, opt]); }} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: selected ? '#E8E0D5' : '#9C8C74', cursor: 'pointer', padding: '8px', borderRadius: 4, background: selected ? 'rgba(212, 175, 104, 0.1)' : 'transparent', border: selected ? '1px solid rgba(212, 175, 104, 0.3)' : '1px solid transparent' }}>
                                                                    <div style={{ width: 16, height: 16, border: `1px solid ${selected ? '#D4AF68' : '#5E4F40'}`, background: selected ? '#D4AF68' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>{selected && <Check size={12} color="#1A120E" />}</div>{opt}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                                {q.type === 'upload' && (
                                                    <div className="file-upload-zone" style={{ padding: 20, border: '1px dashed rgba(196, 168, 111, 0.3)', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}><UploadCloud size={20} color="#5E4F40" style={{ display: 'block', margin: '0 auto 8px' }} /><div style={{ fontSize: 12, color: '#E8E0D5', marginBottom: 4 }}>Drag & drop or click to upload</div><div style={{ fontSize: 10, color: '#9C8C74' }}>PDF, XLSX, CSV (Max 10MB)</div></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={styles.sectionTitle}>Enterprise Health Status</div>
                <div style={{ ...styles.card, marginBottom: 32 }}>
                    <label style={{ ...styles.label, color: '#D4AF68' }}><Activity size={12} style={{ display: 'inline', marginRight: 4 }} /> CURRENT STATUS INDICATOR</label>
                    <select style={styles.select} value={config.companyHealth} onChange={(e) => setConfig({...config, companyHealth: e.target.value})}>
                        <option>Stable Growth</option><option>Hypergrowth</option><option>Turnaround</option><option>Crisis</option>
                    </select>
                </div>

                <div style={styles.sectionTitle}>Operational Directives</div>
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: 20, border: '1px solid rgba(196, 168, 111, 0.1)' }}>
                    {instructions.map((inst, i) => (
                        <div key={i} className="instruction-item"><span className="instruction-num">{i + 1}.</span><span>{inst}</span></div>
                    ))}
                    <div onClick={() => setInstructionsChecked(!instructionsChecked)} style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 12, cursor: 'pointer' }}>
                        <div style={{ width: 20, height: 20, border: `1px solid ${instructionsChecked ? '#D4AF68' : '#5E4F40'}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {instructionsChecked && <Check size={14} color="#1A120E" fill="#D4AF68" style={{ background: '#D4AF68', borderRadius: 2, width: '100%', height: '100%' }} />}
                        </div>
                        <span style={{ fontSize: 13, color: instructionsChecked ? '#D4AF68' : '#9C8C74' }}>I acknowledge these directives and adhere to the protocols.</span>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
                <div style={styles.sectionTitle}>Simulation Parameters</div>
                <div style={{ marginBottom: 16 }}>
                    <label style={styles.label}>INTERACTION MODE</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <ModeOption mode="chat" icon={MessageSquare} label="Text Interface" />
                        <ModeOption mode="3d" icon={Box} label="3D Environment" />
                        <ModeOption mode="video" icon={Video} label="Video Conference" />
                    </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                    <label style={{ ...styles.label, color: '#D4AF68' }}><Hourglass size={12} style={{ display: 'inline', marginRight: 4 }} /> STRATEGIC HORIZON</label>
                    <select style={styles.select} value={config.discussionHorizon} onChange={(e) => setConfig({...config, discussionHorizon: e.target.value})}>
                        <option>Tactical (Current Quarter)</option><option>Annual Planning (1 Year)</option><option>Strategic (3-5 Years)</option><option>Visionary (10+ Years)</option>
                    </select>
                </div>

                <div style={styles.sectionTitle}>Corporate Governance Profile</div>
                <div style={{ ...styles.card, marginBottom: 32 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ ...styles.label, fontSize: 11, color: '#D4AF68' }}> <LayoutDashboard size={12} style={{ display: 'inline', marginRight: 4 }} /> MEETING TYPE</label>
                            <select style={styles.select} value={config.meetingType} onChange={(e) => setConfig({...config, meetingType: e.target.value})}>
                                <option>Quarterly Review</option><option>Budget Approval</option><option>Emergency Session</option><option>AGM</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ ...styles.label, fontSize: 11, color: '#D4AF68' }}> <TrendingUp size={12} style={{ display: 'inline', marginRight: 4 }} /> COMPANY STAGE</label>
                            <select style={styles.select} value={config.companyStage} onChange={(e) => setConfig({...config, companyStage: e.target.value})}>
                                <option>Early Stage (Series A)</option><option>Growth (Series B+)</option><option>Pre-IPO</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ ...styles.sectionTitle, margin: 0 }}>Board of Directors</div>
                        <div style={{ background: 'rgba(212, 175, 104, 0.1)', border: '1px solid #D4AF68', borderRadius: 4, padding: '2px 8px', fontSize: 10, color: '#D4AF68', fontWeight: 700 }}>BOARD</div>
                    </div>
                    {unsavedCharChanges && (
                        <button onClick={handleSaveCharacters} style={styles.saveBtn}><Save size={10} /> Commit Updates</button>
                    )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
                    {characters.map((char) => {
                        const isExpanded = expandedChar === char.id;
                        return (
                            <div key={char.id} className="char-card" style={{ border: `1px solid ${isExpanded ? 'rgba(212, 175, 104, 0.4)' : 'rgba(196, 168, 111, 0.15)'}`, borderRadius: 6, background: isExpanded ? 'rgba(26, 18, 14, 0.8)' : 'rgba(26, 18, 14, 0.4)', overflow: 'hidden', transition: 'all 0.4s' }}>
                                <div onClick={() => setExpandedChar(isExpanded ? null : char.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer', background: isExpanded ? 'rgba(212, 175, 104, 0.05)' : 'transparent' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div className="avatar-circle" style={{ background: char.color }}>{char.initials}</div>
                                        <div><div style={{ fontSize: 14, color: isExpanded ? '#D4AF68' : '#E8E0D5', fontWeight: 500 }}>{char.name}</div><div style={{ fontSize: 11, color: '#9C8C74' }}>{char.role}</div></div>
                                    </div>
                                    <ChevronDown size={16} color="#9C8C74" />
                                </div>
                                {isExpanded && (
                                    <div className="expand-enter" style={{ padding: '0 16px 20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        {char.behaviors.map((beh) => (
                                            <div key={beh.id} style={{ marginTop: 16 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                                                    <span style={{ color: '#9C8C74' }}>{beh.name}</span><span style={{ color: '#D4AF68' }}>{beh.val}%</span>
                                                </div>
                                                <input type="range" min="0" max="100" value={beh.val} onChange={(e) => handleBehaviorChange(char.id, beh.id, parseInt(e.target.value))} style={{ width: '100%', accentColor: '#D4AF68', height: 4, background: 'rgba(255,255,255,0.1)', appearance: 'auto' }} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        <div style={{ marginTop: 60, paddingTop: 30, borderTop: '1px solid rgba(196, 168, 111, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={onBack} className="btn-hover" style={{ background: 'none', border: 'none', color: '#8A3A3A', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', transition: 'color 0.2s' }}>ABORT SETUP</button>
            <div style={{ position: 'relative' }}>
                <button onClick={handleStart} style={{ ...styles.goldBtn, opacity: completionPercent === 100 ? 1 : 0.7 }}>
                    {completionPercent === 100 ? "INITIATE SIMULATION" : <><AlertTriangle size={12} /> INITIATION PENDING</>}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default BoardRoom;