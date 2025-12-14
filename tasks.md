# Tasks: Psychological Support Platform - Sprints 1 & 2

## Phase 1: Setup & Dependencies
- [ ] T001 Install `resend` package for email notifications
- [ ] T002 Add `RESEND_API_KEY` and `ADMIN_EMAIL` to `.env` and `.env.example`

## Phase 2: Sprint 1 - Email Notifications (Speed-to-Lead) [US1]
**Goal**: Notify the administrator immediately when a high-potential lead is identified.
- [ ] T003 [US1] Create email service in `server/services/email.ts` with `sendLeadAlert` function
- [ ] T004 [US1] Create HTML email template for lead alerts (including name, score, urgency, and link to dashboard)
- [ ] T005 [US1] Integrate email trigger in `server/services/leadScore.ts` (trigger when score >= 70 or urgency is 'critical')
- [ ] T006 [US1] Add error handling to ensure email failures don't block the chat flow

## Phase 3: Sprint 2 - Beta Mode UI [US2]
**Goal**: Inform users that the platform is currently in a free testing phase.
- [ ] T007 [US2] Create `BetaBanner` component in `src/components/BetaBanner.tsx`
- [ ] T008 [US2] Add `BetaBanner` to the top of `src/components/Dashboard.tsx`
- [ ] T009 [US2] Add "Beta" badge to the `LandingPage.tsx` header

## Phase 4: Verification & Polish
- [ ] T010 Verify `LeadDetailDialog.tsx` Human Takeover UI (Switch and Chat Input) renders correctly
- [ ] T011 Test email notification flow with a mock high-score lead
- [ ] T012 Verify Gemini API key rotation (manual check of .env)

## Dependencies
- US1 (Notifications) depends on T001, T002
- US2 (Beta UI) is independent

## Implementation Strategy
1. **Immediate**: Install Resend and configure env vars.
2. **Backend**: Implement the email service and trigger logic.
3. **Frontend**: Add the Beta visual cues.
