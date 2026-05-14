'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

const currency = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-AU');

type Frequency = 'monthly' | 'fortnightly' | 'weekly';
type StateCode = 'VIC' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

const stateTransferRate: Record<StateCode, number> = {
  VIC: 0.055,
  NSW: 0.052,
  QLD: 0.047,
  WA: 0.0515,
  SA: 0.052,
  TAS: 0.04,
  ACT: 0.05,
  NT: 0.0495,
};

function parseNumber(value: string) {
  return Number(value.replace(/,/g, '')) || 0;
}

function repaymentAmount(principal: number, annualRate: number, years: number, frequency: Frequency) {
  const periodsPerYear = frequency === 'monthly' ? 12 : frequency === 'fortnightly' ? 26 : 52;
  const totalPeriods = years * periodsPerYear;
  const periodRate = annualRate / 100 / periodsPerYear;

  if (!principal || !totalPeriods) {
    return 0;
  }

  if (periodRate === 0) {
    return principal / totalPeriods;
  }

  return (principal * periodRate) / (1 - Math.pow(1 + periodRate, -totalPeriods));
}

function monthlyRepaymentAmount(principal: number, annualRate: number, years: number) {
  return repaymentAmount(principal, annualRate, years, 'monthly');
}

function formatYearsMonths(months: number) {
  if (!Number.isFinite(months) || months <= 0) {
    return 'Not available';
  }

  const roundedMonths = Math.round(months);
  const years = Math.floor(roundedMonths / 12);
  const remainingMonths = roundedMonths % 12;

  if (!years) {
    return `${remainingMonths} months`;
  }

  if (!remainingMonths) {
    return `${years} years`;
  }

  return `${years} years, ${remainingMonths} months`;
}

function totalRentPaid(monthlyRent: number, annualIncrease: number, years: number) {
  const fullYears = Math.max(Math.round(years), 0);
  let total = 0;

  for (let index = 0; index < fullYears; index += 1) {
    total += monthlyRent * 12 * Math.pow(1 + annualIncrease / 100, index);
  }

  return total;
}

function borrowingCapacity(
  householdIncome: number,
  otherIncome: number,
  expenses: number,
  debts: number,
  annualRate: number,
  years: number,
) {
  const monthlyIncome = (householdIncome + otherIncome) / 12;
  const availableMonthly = Math.max(monthlyIncome * 0.82 - expenses - debts - 900, 0);
  const assessmentRate = Math.max(annualRate + 3, 7.25) / 100 / 12;
  const months = years * 12;

  if (!availableMonthly || !months) {
    return 0;
  }

  return availableMonthly * ((1 - Math.pow(1 + assessmentRate, -months)) / assessmentRate);
}

function upfrontCosts(propertyPrice: number, deposit: number, state: StateCode, firstHomeBuyer: boolean) {
  const transferDutyBase = propertyPrice * stateTransferRate[state];
  const firstHomeConcession = firstHomeBuyer && propertyPrice <= 800000 ? transferDutyBase * 0.75 : 0;
  const transferDuty = Math.max(transferDutyBase - firstHomeConcession, 0);
  const registration = state === 'VIC' ? 2700 : 1800;
  const legal = 1800;
  const inspections = 850;
  const lenderFees = 700;
  const lmiEstimate = deposit / propertyPrice < 0.2 ? propertyPrice * 0.018 : 0;

  return {
    transferDuty,
    registration,
    legal,
    inspections,
    lenderFees,
    lmiEstimate,
    total: transferDuty + registration + legal + inspections + lenderFees + lmiEstimate,
  };
}

export function FinanceCalculators() {
  const [loanAmount, setLoanAmount] = useState('650000');
  const [interestRate, setInterestRate] = useState('6.25');
  const [loanTerm, setLoanTerm] = useState('30');
  const [frequency, setFrequency] = useState<Frequency>('monthly');

  const [income, setIncome] = useState('145000');
  const [otherIncome, setOtherIncome] = useState('0');
  const [expenses, setExpenses] = useState('4200');
  const [debts, setDebts] = useState('450');

  const [propertyPrice, setPropertyPrice] = useState('800000');
  const [deposit, setDeposit] = useState('160000');
  const [state, setState] = useState<StateCode>('VIC');
  const [firstHomeBuyer, setFirstHomeBuyer] = useState(true);
  const [currentRate, setCurrentRate] = useState('6.80');
  const [newRate, setNewRate] = useState('6.15');
  const [switchingCosts, setSwitchingCosts] = useState('1200');
  const [monthlyRent, setMonthlyRent] = useState('2800');
  const [rentIncrease, setRentIncrease] = useState('3');
  const [propertyGrowth, setPropertyGrowth] = useState('3.5');
  const [comparisonYears, setComparisonYears] = useState('7');

  const repayment = useMemo(
    () => repaymentAmount(parseNumber(loanAmount), parseNumber(interestRate), parseNumber(loanTerm), frequency),
    [frequency, interestRate, loanAmount, loanTerm],
  );

  const annualRepayment = repayment * (frequency === 'monthly' ? 12 : frequency === 'fortnightly' ? 26 : 52);

  const capacity = useMemo(
    () =>
      borrowingCapacity(
        parseNumber(income),
        parseNumber(otherIncome),
        parseNumber(expenses),
        parseNumber(debts),
        parseNumber(interestRate),
        parseNumber(loanTerm),
      ),
    [debts, expenses, income, interestRate, loanTerm, otherIncome],
  );

  const costs = useMemo(
    () => upfrontCosts(parseNumber(propertyPrice), parseNumber(deposit), state, firstHomeBuyer),
    [deposit, firstHomeBuyer, propertyPrice, state],
  );

  const depositRatio = parseNumber(propertyPrice)
    ? Math.min((parseNumber(deposit) / parseNumber(propertyPrice)) * 100, 100)
    : 0;

  const loanPrincipal = parseNumber(loanAmount);
  const annualRate = parseNumber(interestRate);
  const termYears = parseNumber(loanTerm);
  const baseMonthlyRepayment = useMemo(
    () => monthlyRepaymentAmount(loanPrincipal, annualRate, termYears),
    [annualRate, loanPrincipal, termYears],
  );
  const currentMonthlyRepayment = useMemo(
    () => monthlyRepaymentAmount(loanPrincipal, parseNumber(currentRate), termYears),
    [currentRate, loanPrincipal, termYears],
  );
  const newMonthlyRepayment = useMemo(
    () => monthlyRepaymentAmount(loanPrincipal, parseNumber(newRate), termYears),
    [loanPrincipal, newRate, termYears],
  );
  const monthlySwitchingSaving = Math.max(currentMonthlyRepayment - newMonthlyRepayment, 0);
  const switchingBreakEven = monthlySwitchingSaving ? parseNumber(switchingCosts) / monthlySwitchingSaving : 0;
  const rentPaid = useMemo(
    () => totalRentPaid(parseNumber(monthlyRent), parseNumber(rentIncrease), parseNumber(comparisonYears)),
    [comparisonYears, monthlyRent, rentIncrease],
  );
  const futurePropertyValue =
    parseNumber(propertyPrice) * Math.pow(1 + parseNumber(propertyGrowth) / 100, parseNumber(comparisonYears));
  const propertyGrowthValue = Math.max(futurePropertyValue - parseNumber(propertyPrice), 0);
  const buyingOutlay = baseMonthlyRepayment * 12 * parseNumber(comparisonYears) + costs.total;
  const netBuyingCost = Math.max(buyingOutlay - propertyGrowthValue, 0);
  const rentVsBuyDifference = rentPaid - netBuyingCost;

  const calculatorCards = [
    {
      href: '#borrowing-power',
      title: 'Borrowing power',
      body: 'Estimate how much you may be able to borrow before applying.',
    },
    {
      href: '#repayments',
      title: 'Repayments',
      body: 'Compare principal and interest repayments by amount, rate, term, and frequency.',
    },
    {
      href: '#stamp-duty',
      title: 'Stamp duty',
      body: 'Estimate transfer duty, LMI, and common property purchase costs.',
    },
    {
      href: '#rent-vs-buy',
      title: 'Rent vs. Buy',
      body: 'Compare renting with buying over a chosen planning period.',
    },
    {
      href: '#switching',
      title: 'Mortgage switching calculator',
      body: 'Estimate potential savings and break-even timing when switching loans.',
    },
  ];

  return (
    <section className="finance-calculators">
      <div className="calculator-intro">
        <p className="eyebrow">Our free loan calculators</p>
        <h2>Plan your next move with practical Australian loan calculators.</h2>
        <p>
          From estimating your borrowing power to understanding repayments, these tools help you plan smarter
          before you apply.
        </p>
      </div>

      <div className="calculator-directory" aria-label="Calculator list">
        {calculatorCards.map((card) => (
          <a key={card.href} href={card.href}>
            <span>{card.title}</span>
            <p>{card.body}</p>
          </a>
        ))}
      </div>

      <div className="calculator-tabs" aria-label="Australian finance calculators">
        <a href="#borrowing-power">Borrowing Power</a>
        <a href="#repayments">Repayments</a>
        <a href="#stamp-duty">Stamp Duty</a>
        <a href="#rent-vs-buy">Rent vs. Buy</a>
        <a href="#switching">Mortgage Switching</a>
      </div>

      <div className="calculator-layout" id="borrowing-power">
        <article className="calculator-tool">
          <div className="calculator-heading">
            <span>Borrowing power</span>
            <h2>Estimate what you may be able to borrow.</h2>
            <p>This uses broad assumptions only. Actual lender outcomes vary by policy, credit conduct, income type, and commitments.</p>
          </div>
          <div className="calculator-form">
            <label>
              Annual household income
              <input value={income} onChange={(event) => setIncome(event.target.value)} inputMode="numeric" />
            </label>
            <label>
              Other annual income
              <input value={otherIncome} onChange={(event) => setOtherIncome(event.target.value)} inputMode="numeric" />
            </label>
            <label>
              Monthly living expenses
              <input value={expenses} onChange={(event) => setExpenses(event.target.value)} inputMode="numeric" />
            </label>
            <label>
              Other monthly debt repayments
              <input value={debts} onChange={(event) => setDebts(event.target.value)} inputMode="numeric" />
            </label>
          </div>
        </article>
        <aside className="calculator-result">
          <span>Indicative borrowing power</span>
          <strong>{currency.format(capacity)}</strong>
          <p>Assumes an assessment buffer of at least 3% above the entered rate.</p>
        </aside>
      </div>

      <div className="calculator-layout" id="repayments">
        <article className="calculator-tool">
          <div className="calculator-heading">
            <span>Repayments</span>
            <h2>Estimate home loan repayments.</h2>
            <p>Use the rate, term, and repayment frequency you want to compare.</p>
          </div>
          <div className="calculator-form">
            <label>
              Loan amount
              <input value={loanAmount} onChange={(event) => setLoanAmount(event.target.value)} inputMode="numeric" />
            </label>
            <label>
              Interest rate p.a.
              <input value={interestRate} onChange={(event) => setInterestRate(event.target.value)} inputMode="decimal" />
            </label>
            <label>
              Loan term
              <input value={loanTerm} onChange={(event) => setLoanTerm(event.target.value)} inputMode="numeric" />
            </label>
            <label>
              Repayment frequency
              <select value={frequency} onChange={(event) => setFrequency(event.target.value as Frequency)}>
                <option value="monthly">Monthly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
          </div>
        </article>
        <aside className="calculator-result">
          <span>Estimated repayment</span>
          <strong>{currency.format(repayment)}</strong>
          <p>Per {frequency.replace('ly', '')}. Around {currency.format(annualRepayment)} per year.</p>
        </aside>
      </div>

      <div className="calculator-layout" id="stamp-duty">
        <article className="calculator-tool">
          <div className="calculator-heading">
            <span>Stamp duty</span>
            <h2>Estimate transfer duty and upfront purchase costs.</h2>
            <p>Stamp duty rules change by state, property type, buyer status, and concession eligibility.</p>
          </div>
          <div className="calculator-form">
            <label>
              Property price
              <input value={propertyPrice} onChange={(event) => setPropertyPrice(event.target.value)} inputMode="numeric" />
            </label>
            <label>
              Deposit available
              <input value={deposit} onChange={(event) => setDeposit(event.target.value)} inputMode="numeric" />
            </label>
            <label>
              State or territory
              <select value={state} onChange={(event) => setState(event.target.value as StateCode)}>
                <option value="VIC">VIC</option>
                <option value="NSW">NSW</option>
                <option value="QLD">QLD</option>
                <option value="WA">WA</option>
                <option value="SA">SA</option>
                <option value="TAS">TAS</option>
                <option value="ACT">ACT</option>
                <option value="NT">NT</option>
              </select>
            </label>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={firstHomeBuyer}
                onChange={(event) => setFirstHomeBuyer(event.target.checked)}
              />
              First home buyer concession estimate
            </label>
          </div>
        </article>
        <aside className="calculator-result itemised-result">
          <span>Estimated upfront costs</span>
          <strong>{currency.format(costs.total)}</strong>
          <dl>
            <div>
              <dt>Deposit ratio</dt>
              <dd>{numberFormatter.format(depositRatio)}%</dd>
            </div>
            <div>
              <dt>Transfer duty estimate</dt>
              <dd>{currency.format(costs.transferDuty)}</dd>
            </div>
            <div>
              <dt>LMI estimate</dt>
              <dd>{currency.format(costs.lmiEstimate)}</dd>
            </div>
            <div>
              <dt>Other costs</dt>
              <dd>{currency.format(costs.registration + costs.legal + costs.inspections + costs.lenderFees)}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="calculator-layout" id="rent-vs-buy">
        <article className="calculator-tool">
          <div className="calculator-heading">
            <span>Rent vs. Buy</span>
            <h2>Compare renting with buying over time.</h2>
            <p>This simplified comparison uses rent growth, property growth, repayments, and estimated buying costs.</p>
          </div>
          <div className="calculator-form">
            <label>
              Monthly rent
              <input value={monthlyRent} onChange={(event) => setMonthlyRent(event.target.value)} inputMode="numeric" />
            </label>
            <label>
              Annual rent increase %
              <input value={rentIncrease} onChange={(event) => setRentIncrease(event.target.value)} inputMode="decimal" />
            </label>
            <label>
              Property price
              <input value={propertyPrice} onChange={(event) => setPropertyPrice(event.target.value)} inputMode="numeric" />
            </label>
            <label>
              Expected property growth %
              <input value={propertyGrowth} onChange={(event) => setPropertyGrowth(event.target.value)} inputMode="decimal" />
            </label>
            <label>
              Comparison period
              <input value={comparisonYears} onChange={(event) => setComparisonYears(event.target.value)} inputMode="numeric" />
            </label>
          </div>
        </article>
        <aside className="calculator-result itemised-result">
          <span>{rentVsBuyDifference >= 0 ? 'Buying advantage estimate' : 'Renting advantage estimate'}</span>
          <strong>{currency.format(Math.abs(rentVsBuyDifference))}</strong>
          <dl>
            <div>
              <dt>Total rent paid</dt>
              <dd>{currency.format(rentPaid)}</dd>
            </div>
            <div>
              <dt>Buying outlay estimate</dt>
              <dd>{currency.format(buyingOutlay)}</dd>
            </div>
            <div>
              <dt>Estimated property growth</dt>
              <dd>{currency.format(propertyGrowthValue)}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="calculator-layout" id="switching">
        <article className="calculator-tool">
          <div className="calculator-heading">
            <span>Mortgage switching calculator</span>
            <h2>Compare your current loan with a new option.</h2>
            <p>Useful for a first pass before checking discharge fees, package fees, cashback conditions, and lender policy.</p>
          </div>
          <div className="calculator-form">
            <label>
              Current loan balance
              <input value={loanAmount} onChange={(event) => setLoanAmount(event.target.value)} inputMode="numeric" />
            </label>
            <label>
              Years remaining
              <input value={loanTerm} onChange={(event) => setLoanTerm(event.target.value)} inputMode="numeric" />
            </label>
            <label>
              Current rate p.a.
              <input value={currentRate} onChange={(event) => setCurrentRate(event.target.value)} inputMode="decimal" />
            </label>
            <label>
              New rate p.a.
              <input value={newRate} onChange={(event) => setNewRate(event.target.value)} inputMode="decimal" />
            </label>
            <label>
              Estimated switching costs
              <input value={switchingCosts} onChange={(event) => setSwitchingCosts(event.target.value)} inputMode="numeric" />
            </label>
          </div>
        </article>
        <aside className="calculator-result itemised-result">
          <span>Potential monthly saving</span>
          <strong>{currency.format(monthlySwitchingSaving)}</strong>
          <dl>
            <div>
              <dt>Current repayment</dt>
              <dd>{currency.format(currentMonthlyRepayment)} / month</dd>
            </div>
            <div>
              <dt>New repayment</dt>
              <dd>{currency.format(newMonthlyRepayment)} / month</dd>
            </div>
            <div>
              <dt>Break-even estimate</dt>
              <dd>{switchingBreakEven ? formatYearsMonths(switchingBreakEven) : 'No saving shown'}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="calculator-disclaimer">
        <p>
          These free calculators provide general estimates only and are not a loan approval, quote, tax advice,
          or financial advice. Australian lenders apply their own credit policy, assessment rates, living expense
          benchmarks, and verification requirements.
        </p>
        <Link className="primary-button" href="/contact">
          Review my numbers with Puneet
        </Link>
      </div>
    </section>
  );
}
