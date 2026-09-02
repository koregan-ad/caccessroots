-- New workflow states are added separately so PostgreSQL can commit the enum
-- changes before the following migration uses them.
alter type request_status add value if not exists 'pending_review' after 'draft';
alter type approval_kind add value if not exists 'request_review' after 'community_onboarding';
