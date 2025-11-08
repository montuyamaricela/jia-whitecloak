'use client';

import { useState } from 'react';
import FormField from '@/lib/components/ui/custom/FormField';
import CustomDropdown from '@/lib/components/CareerComponents/CustomDropdown';
import { workSetupOptions, employmentTypeOptions } from '../constants';
import philippineCitiesAndProvinces from '../../../../../../public/philippines-locations.json';
import '@/lib/styles/career-details-styles.scss';

const currencyOptions = [
  { name: 'PHP', symbol: '₱' },
  { name: 'USD', symbol: '$' },
  { name: 'EUR', symbol: '€' },
  { name: 'GBP', symbol: '£' },
  { name: 'JPY', symbol: '¥' },
  { name: 'AUD', symbol: 'A$' },
  { name: 'CAD', symbol: 'C$' },
  { name: 'SGD', symbol: 'S$' },
];

export default function CareerInformationCard({
  jobTitle,
  setJobTitle,
  employmentType,
  setEmploymentType,
  workSetup,
  setWorkSetup,
  country,
  setCountry,
  province,
  setProvince,
  city,
  setCity,
  provinceList,
  setProvinceList,
  cityList,
  setCityList,
  salaryNegotiable,
  setSalaryNegotiable,
  minimumSalary,
  setMinimumSalary,
  maximumSalary,
  setMaximumSalary,
}: {
  jobTitle: string;
  setJobTitle: (value: string) => void;
  employmentType: string;
  setEmploymentType: (value: string) => void;
  workSetup: string;
  setWorkSetup: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  province: string;
  setProvince: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  provinceList: any[];
  setProvinceList: (value: any[]) => void;
  cityList: any[];
  setCityList: (value: any[]) => void;
  salaryNegotiable: boolean;
  setSalaryNegotiable: (value: boolean) => void;
  minimumSalary: string;
  setMinimumSalary: (value: string) => void;
  maximumSalary: string;
  setMaximumSalary: (value: string) => void;
}) {
  const [currency, setCurrency] = useState('PHP');
  const handleProvinceChange = (selectedProvince: string) => {
    setProvince(selectedProvince);
    const provinceObj = provinceList.find((p) => p.name === selectedProvince);
    if (provinceObj) {
      const cities = philippineCitiesAndProvinces.cities.filter(
        (city) => city.province === provinceObj.key
      );
      setCityList(cities);
      if (cities.length > 0) {
        setCity(cities[0].name);
      }
    }
  };

  return (
    <div className='career-card'>
      <div className='card-heading'>
        <div className='heading-wrapper'>
          <span className='heading-text'>1. Career Information</span>
        </div>
      </div>
      <div className='card-content'>
        <div className='form-section'>
          <div className='section-heading'>Basic Information</div>
          <FormField name='jobTitle' label='Job Title'>
            <input
              className='input-field'
              type='text'
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder='Enter job title'
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#ffffff',
                border: '1px solid #e9eaeb',
                borderRadius: '8px',
                boxShadow: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                fontFamily: "'Satoshi', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '1.5em',
                color: '#181d27',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#e9eaeb';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9eaeb';
              }}
            />
          </FormField>
        </div>

        <div className='form-section'>
          <div className='section-heading'>Work Setting</div>
          <div className='form-row'>
            <FormField name='employmentType' label='Employment Type'>
              <CustomDropdown
                onSelectSetting={setEmploymentType}
                screeningSetting={employmentType}
                settingList={employmentTypeOptions}
                placeholder='Choose employment type'
              />
            </FormField>
            <FormField name='workSetup' label='Arrangement'>
              <CustomDropdown
                onSelectSetting={setWorkSetup}
                screeningSetting={workSetup}
                settingList={workSetupOptions}
                placeholder='Choose work arrangement'
              />
            </FormField>
          </div>
        </div>

        <div className='form-section'>
          <div className='section-heading'>Location</div>
          <div className='form-row'>
            <FormField name='country' label='Country'>
              <CustomDropdown
                onSelectSetting={setCountry}
                screeningSetting={country}
                settingList={[{ name: 'Philippines' }]}
                placeholder='Select Country'
              />
            </FormField>
            <FormField name='province' label='State / Province'>
              <CustomDropdown
                onSelectSetting={handleProvinceChange}
                screeningSetting={province}
                settingList={provinceList}
                placeholder='Choose state / province'
              />
            </FormField>
            <FormField name='city' label='City'>
              <CustomDropdown
                onSelectSetting={setCity}
                screeningSetting={city}
                settingList={cityList}
                placeholder='Choose city'
              />
            </FormField>
          </div>
        </div>

        <div className='form-section salary-section'>
          <div className='salary-header'>
            <div className='section-heading'>Salary</div>
            <div className='toggle-wrapper'>
              <div
                className={`toggle-switch ${salaryNegotiable ? 'active' : ''}`}
                onClick={() => setSalaryNegotiable(!salaryNegotiable)}
              >
                <div className='toggle-slider'></div>
              </div>
              <span className='toggle-label'>Negotiable</span>
            </div>
          </div>
          <div className='salary-inputs'>
            <FormField name='minimumSalary' label='Minimum Salary'>
              <div className='salary-input-container'>
                <div className='salary-input-content'>
                  <span className='currency-prefix'>
                    {currencyOptions.find((c) => c.name === currency)?.symbol ||
                      '₱'}
                  </span>
                  <input
                    type='number'
                    value={minimumSalary}
                    onChange={(e) => setMinimumSalary(e.target.value)}
                    placeholder='0'
                    min={0}
                    className='salary-input-field'
                  />
                </div>
                <div className='currency-dropdown-wrapper'>
                  <CustomDropdown
                    onSelectSetting={setCurrency}
                    screeningSetting={currency}
                    settingList={currencyOptions}
                    placeholder='PHP'
                  />
                </div>
              </div>
            </FormField>
            <FormField name='maximumSalary' label='Maximum Salary'>
              <div className='salary-input-container'>
                <div className='salary-input-content'>
                  <span className='currency-prefix'>
                    {currencyOptions.find((c) => c.name === currency)?.symbol ||
                      '₱'}
                  </span>
                  <input
                    type='number'
                    value={maximumSalary}
                    onChange={(e) => setMaximumSalary(e.target.value)}
                    placeholder='0'
                    min={0}
                    className='salary-input-field'
                  />
                </div>
                <div className='currency-dropdown-wrapper'>
                  <CustomDropdown
                    onSelectSetting={setCurrency}
                    screeningSetting={currency}
                    settingList={currencyOptions}
                    placeholder='PHP'
                  />
                </div>
              </div>
            </FormField>
          </div>
        </div>
      </div>
    </div>
  );
}
