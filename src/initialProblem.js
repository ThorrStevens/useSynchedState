import React, { Fragment, useState, useEffect } from "react";

// INITIAL PROBLEM: 'checked' property on radio buttons tends to get out of sync...
// ...with react-dom (where the props are correct according to devtools)
// More info & screenshots: https://github.com/facebook/react/issues/3005#issuecomment-463240372

/* --- useSynchedState ------------------------------------------------------------------------------ */
// Updates state when prop value changes

const useSynchedState = (propValue, setStateCallback = null) => {
  // State
  const [stateValue, setStateValue] = useState(propValue);

  // Update state when prop value changes
  let synchTriggered = false;
  useEffect(
    () => {
      synchTriggered = true; // Indicate the prop has changed
      if (propValue !== stateValue) setStateValue(propValue);
    },
    [propValue] // Only fire when propValue has changed
  );

  // Fire callback on setState (if provided)
  useEffect(
    () => {
      if (
        !synchTriggered &&
        setStateCallback &&
        typeof setStateCallback === "function"
      ) {
        setStateCallback(stateValue);
      }
    },
    [stateValue, setStateCallback] // Only fire callback when stateValue was changed
  );

  // Return array with latest value + state setter
  return [
    // 0: latest value
    synchTriggered ? propValue : stateValue,
    // 1: state setter
    setStateValue,
    // 2: metadata (optional)
    synchTriggered
  ];
};

/* --- <FormOption/> ------------------------------------------------------------------------------ */

const FormOption = props => {
  // Extract props
  const {
    type = "checkbox",
    lbl,
    name,
    value,
    id,
    disabled,
    readOnly,
    onChange,
    isCustom
  } = props;

  // Synched State
  const [checked, setChecked] = useSynchedState(props.checked, onChange); // synchs prop & state values

  // OptionJSX: checkbox / radiobutton
  const OptionJSX = (
    <input
      type={type}
      name={name}
      checked={checked}
      id={id}
      className={isCustom ? "custom-control-input" : "form-check-input"}
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      // Triggers onChange callback passed to useSynchedState
      onChange={e => setChecked(e.currentTarget.checked)}
    />
  );

  // Render
  return (
    <div
      className={isCustom ? `custom-control custom-${type}` : "form-check"}
      key={id}
    >
      {isCustom ? (
        <Fragment>
          {OptionJSX}
          <label htmlFor={id} className="custom-control-label">
            {lbl}
          </label>
        </Fragment>
      ) : (
        <label htmlFor={id} className="form-check-label">
          <span className={`input${checked ? " checked" : ""}`}>
            {OptionJSX}
          </span>
          {` ${lbl}`}
        </label>
      )}
    </div>
  );
};

/* --- <FormRadioList/> ------------------------------------------------------------------------------ */

export const FormRadioList = props => {
  // Extract props
  const {
    choiceOrder,
    choices,
    name,
    disabled,
    readOnly,
    isCustom,
    onChange
  } = props;

  // Synched State
  const [value, setValue] = useSynchedState(props.value, onChange); // synchs prop & state values

  // Choice ordering
  const orderedChoices = choiceOrder || Object.keys(choices);

  // Render
  return (
    <div>
      {orderedChoices.map(choice => (
        <FormOption
          key={`radio-problem-${choice}`}
          id={`radio-problem-${choice}`}
          type="radio"
          name={name}
          value={choice}
          checked={value === choice}
          lbl={choices[choice]}
          disabled={disabled}
          readOnly={readOnly}
          isCustom={isCustom}
          // Triggers onChange callback passed to useSynchedState
          onChange={val => {
            if (val) setValue(choice);
          }}
        />
      ))}
    </div>
  );
};

/* --- Export & Explain Initial Problem -------------------------- */

const InitialProblem = () => (
  <div>
    <h2>Initial Problem:</h2>
    <p>
      'checked' property on radio buttons tends to get out of sync with
      react-dom (where the props are correct according to devtools)
    </p>
    <p>
      More info & screenshots:&nbsp;
      <a href="https://github.com/facebook/react/issues/3005#issuecomment-463240372">
        https://github.com/facebook/react/issues/3005#issuecomment-463240372
      </a>
    </p>
    <p>
      The code that caused / describe the initial probel are found in
      initialProblem.js
    </p>
    <p>Try checking a different option a bunch of times:</p>
    <FormRadioList
      choiceOrder={["firstchoice", "secondchoice", "thirdchoice"]}
      choices={{
        firstchoice: "First Choice",
        secondchoice: "Second Choice",
        thirdchoice: "Third Choice"
      }}
      name="someradiolist"
      disabled={false}
      readOnly={false}
      isCustom={false}
      onChange={choice => console.log("Problem choice changed:", choice)}
    />
    <br />
    <hr />
  </div>
);

export default InitialProblem;
