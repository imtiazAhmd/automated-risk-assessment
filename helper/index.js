// Is the claim over £5K?
// Is there an assigned counsel?
// Is there an uplift/enhancement applied?
// Is it an extradition?
// Is the rep order withdrawn?
// ==> IF ANY ONE IS TRUE >> HIGH RISK
// ==> IF ALL ARE FALSE >> AUTOMATE

import chalk from 'chalk'
const data = {
  claim_profit_costs: 1121.78,
  claim_disbursements: 61.32,
  claim_travel: 74.88,
  claim_waiting: 259.20,
  assigned_counsel: false,
  rep_order_withdrawn: false,
  extradition: false,
  no_of_pages_prosecution_evidence: 50,
  no_of_pages_defence_statements: 1,
  no_of_defence_witness: 1,
  attendance_time: 282, // Mins
  prep_time: 552, // Mins
  advocacy_time: 246, // Mins
  uplift: false,
  cctv_length: 24, // Mins
}
data.claim_total =
  data.claim_profit_costs +
  data.claim_disbursements +
  data.claim_travel +
  data.claim_waiting
const atleast_any_one_of_the_condition_is_true =
  data.claim_total > 5000 ||
  data.assigned_counsel ||
  data.uplift ||
  data.extradition ||
  data.rep_order_withdrawn

function bill_is_high_risk() {
  // Is the claim over £5K?
  // Is there an assigned counsel?
  // Is there an uplift/enhancement applied?
  // Is it an extradition?
  // Is the rep order withdrawn?
  // IF any of the above is TRUE then HighRisk
  return atleast_any_one_of_the_condition_is_true
}

function prep_and_att_validation() {
  // Are preparation and attendance times equal or less than double the advocacy?
  return data.prep_time + data.attendance_time <= data.advocacy_time * 2
}

function get_new_preptime() {
  // Double the totals for prosecution evidence, defence statements, Tape/CCTV length and for each defence witness allow 30minutes
  const prosecution_evidence_prep_time =
    data.no_of_pages_prosecution_evidence * 2 * 2
  const defence_statements_prep_time = data.no_of_pages_defence_statements * 2 // it takes 00:02 per page to assess
  const defence_witness_prep_time = data.no_of_defence_witness * 30 // it takes avg 00:30 to assess one defence witness
  return (
    prosecution_evidence_prep_time +
    defence_statements_prep_time +
    data.cctv_length -
    defence_witness_prep_time
  )
}

function advocacy_time_validation() {
  //is new 'prep' time equal or less than advocacy x2 AND
  //is the attendance equal or less than advocacy x2?
  const new_preptime = get_new_preptime()
  const double_the_advocacy_time = data.advocacy_time * 2
  return (
    new_preptime <= double_the_advocacy_time &&
    data.attendance_time <= double_the_advocacy_time
  )
}

export function risk_automation_process() {
  if (
    !bill_is_high_risk() &&
    (prep_and_att_validation() || advocacy_time_validation())
  ) {
    return chalk.bold.white.bgGreenBright('  Bill is LOW RISK  ')
  } else if (bill_is_high_risk()) {
    return chalk.bold.white.bgRed('  Bill is HIGH RISK  ')
  } else return chalk.bold.black.bgYellow('  Bill is MEDIUM RISK  ')
}
