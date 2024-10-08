// Is the claim over £5K?
// Is there an assigned counsel?
// Is there an uplift/enhancement applied?
// Is it an extradition?
// Is the rep order withdrawn?
// ==> IF ANY ONE IS TRUE >> HIGH RISK
// ==> IF ALL ARE FALSE >> AUTOMATE

import chalk from 'chalk'
import { data } from './data.js'

data.claim_total =
  data.claim_profit_costs +
  data.claim_disbursements +
  data.claim_travel +
  data.claim_waiting

const multipliers = {
  prosecution_evidence: 2,
  defence_statements: 2, // it takes 00:02 per page to assess
  defence_witness: 30, // it takes avg 00:30 to assess one defence witness
  advocacy_time: 2,
}

function convertToMinutes(timeObject) {
  return timeObject.hours * 60 + timeObject.mins;
}

let prep_time = convertToMinutes(data.prep_time);
let attendance_time = convertToMinutes(data.attendance_time);
let advocacy_time = convertToMinutes(data.advocacy_time);

function bill_is_high_risk() {
  // Is the claim over £5K?
  // Is there an assigned counsel?
  // Is there an uplift/enhancement applied?
  // Is it an extradition?
  // Is the rep order withdrawn?
  // IF any of the above is TRUE then HighRisk
  return (
    data.claim_total > 5000 ||
    data.assigned_counsel ||
    data.uplift ||
    data.extradition ||
    data.rep_order_withdrawn
  );
}

function prep_and_att_validation() {
  // Are preparation equal or less than double the advocacy? AND
  // Are attendance times equal or less than double the advocacy?
  let doubleTheAdvocacyTime = advocacy_time * multipliers.advocacy_time;
  return prep_time <= doubleTheAdvocacyTime && attendance_time <= doubleTheAdvocacyTime;
}

function get_new_preptime() {
  // Double the totals for prosecution evidence, defence statements, Tape/CCTV length and for each defence witness allow 30minutes
  const prosecution_evidence_prep_time =
    data.no_of_pages_prosecution_evidence * multipliers.prosecution_evidence
  const defence_statements_prep_time = data.no_of_pages_defence_statements * multipliers.defence_statements
  const defence_witness_prep_time = data.no_of_defence_witness * multipliers.defence_witness
  const new_prep_time = (prosecution_evidence_prep_time + defence_statements_prep_time + data.cctv_length + defence_witness_prep_time) - prep_time
  return new_prep_time
}

function advocacy_time_validation() {
  //is new 'prep' time equal or less than advocacy x2 AND
  //is the attendance equal or less than advocacy x2?
  const new_preptime = get_new_preptime()
  const double_the_advocacy_time = advocacy_time * multipliers.advocacy_time
  return (
    new_preptime <= double_the_advocacy_time &&
    attendance_time <= double_the_advocacy_time
  )
}

export function risk_automation_process() {
  let isHighRisk = bill_is_high_risk();
  let validation = prep_and_att_validation() || advocacy_time_validation();
  if (!isHighRisk && validation) {
    return chalk.bold.white.bgGreenBright('  Bill is LOW RISK  ')
  } else if (isHighRisk) {
    return chalk.bold.white.bgRed('  Bill is HIGH RISK  ')
  } else {
    return chalk.bold.black.bgYellow('  Bill is MEDIUM RISK  ')
  }
}
