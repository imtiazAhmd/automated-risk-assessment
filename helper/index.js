// Is the claim over £5K?
// Is there an assigned counsel?
// Is there an uplift/enhancement applied?
// Is it an extradition?
// Is the rep order withdrawn?
// ==> IF ANY ONE IS TRUE >> HIGH RISK
// ==> IF ALL ARE FALSE >> AUTOMATE

import chalk from 'chalk'
const data = {
  claim_profit_costs: 639.17,
  claim_disbursements: 0,
  claim_travel: 11.52,
  claim_waiting: 23.04,
  assigned_counsel: false,
  rep_order_withdrawn: false,
  extradition: false,
  no_of_pages_prosecution_evidence: 38,
  no_of_pages_defence_statements: 6,
  no_of_defence_witness: 0,
  attendance_time: 186, // Mins
  prep_time: 336, // Mins
  advocacy_time: 90, // Mins
  uplift: false,
  cctv_length: 0, // Mins
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

const multipliers = {
  prosecution_evidence: 4,
  defence_statements: 2, // it takes 00:02 per page to assess
  defence_witness: 30, // it takes avg 00:30 to assess one defence witness
  advocacy_time: 2,
}
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
  return data.prep_time + data.attendance_time <= data.advocacy_time * multipliers.advocacy_time
}

function get_new_preptime() {
  // Double the totals for prosecution evidence, defence statements, Tape/CCTV length and for each defence witness allow 30minutes
  const prosecution_evidence_prep_time =
    data.no_of_pages_prosecution_evidence * multipliers.prosecution_evidence
  const defence_statements_prep_time = data.no_of_pages_defence_statements * multipliers.defence_statements
  const defence_witness_prep_time = data.no_of_defence_witness * multipliers.defence_witness
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
