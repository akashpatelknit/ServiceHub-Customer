/** Static placeholder roles — no ATS/applications backend exists yet, so "Apply" is a mailto: link. Swap for a real careers API once one exists. */
export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

export const JOB_OPENINGS: JobOpening[] = [
  { id: 'ops-vendor-success', title: 'Operations Manager, Vendor Success', department: 'Operations', location: 'Bengaluru', type: 'Full-time' },
  { id: 'backend-engineer', title: 'Backend Engineer', department: 'Engineering', location: 'Remote (India)', type: 'Full-time' },
  { id: 'customer-support-associate', title: 'Customer Support Associate', department: 'Customer Experience', location: 'Mumbai', type: 'Full-time' },
  { id: 'category-manager-home-services', title: 'Category Manager, Home Services', department: 'Growth', location: 'Delhi NCR', type: 'Full-time' },
  { id: 'product-designer', title: 'Product Designer', department: 'Design', location: 'Remote (India)', type: 'Full-time' },
];
