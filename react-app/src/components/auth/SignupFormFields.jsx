import {
  categoryOptions,
  educationLevelOptions,
  states,
} from '../../data/mockData';

const genderOptions = ['Male', 'Female', 'Other'];
const studentTypeOptions = ['School', 'College'];

export function createInitialSignupForm() {
  return {
    name: '',
    email: '',
    mobile: '',
    dateOfBirth: '',
    gender: '',
    studentType: '',
    collegeName: '',
    password: '',
    confirmPassword: '',
    state: '',
    category: '',
    income: '',
    educationLevel: '',
    cgpa: '',
    acceptTerms: true,
  };
}

export function validateSignupForm(form) {
  if (!form.name.trim()) {
    return 'Name is required.';
  }

  if (!form.email.trim()) {
    return 'Email is required.';
  }

  if (!/\S+@\S+\.\S+/.test(form.email)) {
    return 'Enter a valid email address.';
  }

  if (form.password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (form.password !== form.confirmPassword) {
    return 'Password confirmation does not match.';
  }

  if (!form.mobile.trim()) {
    return 'Mobile number is required.';
  }

  const mobileDigits = form.mobile.replace(/\D/g, '');
  if (mobileDigits.length < 10) {
    return 'Enter a valid mobile number.';
  }

  if (!form.dateOfBirth) {
    return 'Date of birth is required.';
  }

  if (!form.gender) {
    return 'Gender is required.';
  }

  if (!form.studentType) {
    return 'Student type is required.';
  }

  if (!form.collegeName.trim()) {
    return 'School or college name is required.';
  }

  if (!form.state) {
    return 'State is required.';
  }

  if (!form.category) {
    return 'Category is required.';
  }

  const income = Number(form.income);
  if (!Number.isFinite(income) || income <= 0) {
    return 'Income must be a positive number.';
  }

  if (!form.educationLevel) {
    return 'Education level is required.';
  }

  const cgpa = Number(form.cgpa);
  if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10) {
    return 'CGPA must be between 0 and 10.';
  }

  if (!form.acceptTerms) {
    return 'Please accept the terms before continuing.';
  }

  return null;
}

export default function SignupFormFields({
  error,
  form,
  loading,
  onFieldChange,
  onSubmit,
  submitLabel,
  successMessage,
}) {
  return (
    <form className="stack-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label className="form-field">
          <span>Full name</span>
          <input
            className="input"
            onChange={onFieldChange('name')}
            placeholder="Enter your full name"
            type="text"
            value={form.name}
          />
        </label>

        <label className="form-field">
          <span>Email address</span>
          <input
            className="input"
            onChange={onFieldChange('email')}
            placeholder="Enter your email address"
            type="email"
            value={form.email}
          />
        </label>
      </div>

      <div className="form-grid">
        <label className="form-field">
          <span>Mobile number</span>
          <input
            className="input"
            onChange={onFieldChange('mobile')}
            placeholder="Enter your mobile number"
            type="tel"
            value={form.mobile}
          />
        </label>

        <label className="form-field">
          <span>Date of birth</span>
          <input
            className="input"
            onChange={onFieldChange('dateOfBirth')}
            type="date"
            value={form.dateOfBirth}
          />
        </label>
      </div>

      <div className="form-grid">
        <label className="form-field">
          <span>Gender</span>
          <select className="input" onChange={onFieldChange('gender')} value={form.gender}>
            <option value="">Select your gender</option>
            {genderOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Student type</span>
          <select
            className="input"
            onChange={onFieldChange('studentType')}
            value={form.studentType}
          >
            <option value="">Select student type</option>
            {studentTypeOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="form-field">
        <span>School / college name</span>
        <input
          className="input"
          onChange={onFieldChange('collegeName')}
          placeholder="Enter your institution name"
          type="text"
          value={form.collegeName}
        />
      </label>

      <div className="form-grid">
        <label className="form-field">
          <span>Password</span>
          <input
            className="input"
            onChange={onFieldChange('password')}
            placeholder="Create a password"
            type="password"
            value={form.password}
          />
        </label>

        <label className="form-field">
          <span>Confirm password</span>
          <input
            className="input"
            onChange={onFieldChange('confirmPassword')}
            placeholder="Confirm your password"
            type="password"
            value={form.confirmPassword}
          />
        </label>
      </div>

      <div className="form-grid">
        <label className="form-field">
          <span>State</span>
          <select className="input" onChange={onFieldChange('state')} value={form.state}>
            <option value="">Select your state</option>
            {states.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Category</span>
          <select className="input" onChange={onFieldChange('category')} value={form.category}>
            <option value="">Select your category</option>
            {categoryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-grid">
        <label className="form-field">
          <span>Annual income</span>
          <input
            className="input"
            inputMode="numeric"
            min="0"
            onChange={onFieldChange('income')}
            placeholder="Enter annual income"
            type="number"
            value={form.income}
          />
        </label>

        <label className="form-field">
          <span>Education level</span>
          <select
            className="input"
            onChange={onFieldChange('educationLevel')}
            value={form.educationLevel}
          >
            <option value="">Select education level</option>
            {educationLevelOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="form-field">
        <span>CGPA</span>
        <input
          className="input"
          inputMode="decimal"
          max="10"
          min="0"
          onChange={onFieldChange('cgpa')}
          placeholder="Enter your CGPA"
          step="0.1"
          type="number"
          value={form.cgpa}
        />
      </label>

      <label className="checkbox-line">
        <input
          checked={form.acceptTerms}
          onChange={onFieldChange('acceptTerms')}
          type="checkbox"
        />
        <span>I agree to the terms, privacy policy, and scholarship data processing notice.</span>
      </label>

      {error ? <p className="form-error">{error}</p> : null}
      {successMessage ? <p className="form-success">{successMessage}</p> : null}

      <button className="button button--primary" disabled={loading} type="submit">
        {loading ? 'Creating account...' : submitLabel}
      </button>
    </form>
  );
}
