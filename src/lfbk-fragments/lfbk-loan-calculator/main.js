import React, {useMemo, useState} from 'react';
import ClaySlider from '@clayui/slider';

const InputSlider = (props) => {
	const {
		currency,
		id,
		label,
		max,
		min,
		onValueChange,
		sliderType, 
		step,
		units,
		value
	} = props;

	const [editing, setEditing] = useState(false);
	const [editValue, setEditValue] = useState(value);

  const handleBlur = () => {
		let val = editValue;

		val = parseFloat(val);

		if (isNaN(val) || val < min) {
			val = min;
		}
		else if (val > max) {
			val = max;
		}
		else if (val % step != 0) {
			val = Math.floor(val / step) * step;
		}

		onValueChange(val);
		setEditValue(val);

		setEditing(!editing);
	}

	const formatter = Intl.NumberFormat(themeDisplay.getBCP47LanguageId(), {
		currency: currency,
		maximumFractionDigits: 2,
		style: sliderType
	});
	
	const editValueInput = <input
		autoFocus
		className="unstyled-input"
		key="input"
		onBlur={handleBlur}
		onChange={event => setEditValue(event.target.value)}
		size={editValue.toString().length}
		type="text"
		value={editValue}
	/>;

	let formattedValue = sliderType != "percent" ? formatter.format(value) : formatter.format(value/100);
	let formattedMax = sliderType != "percent" ? formatter.format(max) : formatter.format(max/100);
	let formattedMin = sliderType != "percent" ? formatter.format(min) : formatter.format(min/100);

	if (units && sliderType == "decimal") {
		formattedValue += ` ${units}`;
		formattedMax += ` ${units}`;
		formattedMin += ` ${units}`;
	}

	const valueDisplay = editing ? editValueInput : <span key="value">{formattedValue}</span>;

	return (
		<div className="form-group">
			<div className="d-flex justify-content-between">
				<label htmlFor={id}><h3>{label}</h3></label>

				<div className="value-container" onClick={() => setEditing(true)}>{valueDisplay}</div>
			</div>

			<ClaySlider
				id={id}
				max={max}
				min={min}
				onValueChange={onValueChange}
				step={step}
				value={value}
			/>

			<div className="d-flex justify-content-between">
				<label className="min">{formattedMin}</label>
				<label className="max">{formattedMax}</label>
			</div>
		</div>
	);
}

const LoanCaculator = (props) => {

	const configuration = useMemo(
		() => {
			const portletInstance = props.configuration;

			const c = {};

			Object.keys(portletInstance).forEach(
				key => {
					const value = portletInstance[key];

					if (value.length > 0) {
						c[key] = value;
					}
				}
			);

			return c;
		},
		[]
	);

	const {
		amountLabel,
		amountUnits,
		amountInitValue,
		amountMinValue,
		amountMaxValue,
		amountStepSize,
		termLabel,
		termUnits,
		termInitValue,
		termMinValue,
		termMaxValue,
		termStepSize,
		monthsPerTermUnit,
		interestRateLabel,
		interestRateInitValue,
		interestRateMinValue,
		interestRateMaxValue,
		interestRateStepSize
	} = configuration;

	const [interestRate, setInterestRate] = useState(parseFloat(interestRateInitValue));
	const [loanAmount, setLoanAmount] = useState(parseFloat(amountInitValue));
	const [term, setTerm] = useState(parseFloat(termInitValue));

	const monthlyPayment = useMemo(
		() => {
			const P = loanAmount;
			const J = interestRate/(12*100);
			const N = term * parseFloat(monthsPerTermUnit);

			return P * (J/(1-(1+J) ** -N));
		},
		[interestRate, loanAmount, term]
	);

	const formatter = Intl.NumberFormat(themeDisplay.getBCP47LanguageId(), {
		style: 'currency',
		currency: amountUnits,
  		maximumFractionDigits: 2,
	});

	const formattedMonthlyPayment = formatter.format(monthlyPayment);

	return (
		<div className="loanCaculator">
			<InputSlider
				currency={amountUnits}
				id="loanAmount"
				label={amountLabel}
				max={parseFloat(amountMaxValue)}
				min={parseFloat(amountMinValue)}
				onValueChange={setLoanAmount}
				sliderType="currency"
				step={amountStepSize}
				value={loanAmount}
			/>

			<InputSlider
				currency={amountUnits}
				id="term"
				label={termLabel}
				max={parseFloat(termMaxValue)}
				min={parseFloat(termMinValue)}
				onValueChange={setTerm}
				sliderType="decimal"
				step={parseFloat(termStepSize)}
				units={termUnits}
				value={term}
			/>

			<InputSlider
				currency={amountUnits}
				id="interestRate"
				label={interestRateLabel}
				max={parseFloat(interestRateMaxValue)}
				min={parseFloat(interestRateMinValue)}
				onValueChange={setInterestRate}
				sliderType="percent"
				step={interestRateStepSize}
				value={interestRate}
			/>

			<div className="mt-2 align-items-end d-flex flex-wrap justify-content-around">
				<h4>Monthly Payment: </h4>

				<div className="display-4 flex-shrink-0 mx-1">{formattedMonthlyPayment}</div>
			</div>
		</div>
	);
}

export default LoanCaculator;