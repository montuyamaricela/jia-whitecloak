import CustomDropdown from '@/lib/components/CareerComponents/CustomDropdown';
import { workSetupOptions, employmentTypeOptions } from './constants';
import philippineCitiesAndProvinces from '../../../../../public/philippines-locations.json';

export default function AdditionalInformationCard({
  employmentType,
  setEmploymentType,
  workSetup,
  setWorkSetup,
  workSetupRemarks,
  setWorkSetupRemarks,
  salaryNegotiable,
  setSalaryNegotiable,
  minimumSalary,
  setMinimumSalary,
  maximumSalary,
  setMaximumSalary,
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
}: {
  employmentType: string;
  setEmploymentType: (value: string) => void;
  workSetup: string;
  setWorkSetup: (value: string) => void;
  workSetupRemarks: string;
  setWorkSetupRemarks: (value: string) => void;
  salaryNegotiable: boolean;
  setSalaryNegotiable: (value: boolean) => void;
  minimumSalary: string;
  setMinimumSalary: (value: string) => void;
  maximumSalary: string;
  setMaximumSalary: (value: string) => void;
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
}) {
  return (
    <div className='layered-card-outer'>
      <div className='layered-card-middle'>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              backgroundColor: '#181D27',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i
              className='la la-ellipsis-h'
              style={{ color: '#FFFFFF', fontSize: 20 }}
            ></i>
          </div>
          <span style={{ fontSize: 16, color: '#181D27', fontWeight: 700 }}>
            Additional Information
          </span>
        </div>
        <div className='layered-card-content'>
          <span style={{ fontSize: 16, color: '#181D27', fontWeight: 700 }}>
            Work Setting
          </span>
          <span>Employment Type</span>
          <CustomDropdown
            onSelectSetting={(employmentType) => {
              setEmploymentType(employmentType);
            }}
            screeningSetting={employmentType}
            settingList={employmentTypeOptions}
            placeholder='Select Employment Type'
          />

          <span>Work Setup Arrangement</span>
          <CustomDropdown
            onSelectSetting={(setting) => {
              setWorkSetup(setting);
            }}
            screeningSetting={workSetup}
            settingList={workSetupOptions}
            placeholder='Select Work Setup'
          />

          <span>Work Setup Remarks</span>
          <input
            className='form-control'
            placeholder='Additional remarks about work setup (optional)'
            value={workSetupRemarks}
            onChange={(e) => {
              setWorkSetupRemarks(e.target.value || '');
            }}
          ></input>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 16, color: '#181D27', fontWeight: 700 }}>
              Salary
            </span>

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 8,
                minWidth: '130px',
              }}
            >
              <label className='switch'>
                <input
                  type='checkbox'
                  checked={salaryNegotiable}
                  onChange={() => setSalaryNegotiable(!salaryNegotiable)}
                />
                <span className='slider round'></span>
              </label>
              <span>{salaryNegotiable ? 'Negotiable' : 'Fixed'}</span>
            </div>
          </div>

          <span>Minimum Salary</span>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '16px',
                pointerEvents: 'none',
              }}
            >
              P
            </span>
            <input
              type='number'
              className='form-control'
              style={{ paddingLeft: '28px' }}
              placeholder='0'
              min={0}
              value={minimumSalary}
              onChange={(e) => {
                setMinimumSalary(e.target.value || '');
              }}
            />
            <span
              style={{
                position: 'absolute',
                right: '30px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '16px',
                pointerEvents: 'none',
              }}
            >
              PHP
            </span>
          </div>

          <span>Maximum Salary</span>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '16px',
                pointerEvents: 'none',
              }}
            >
              P
            </span>
            <input
              type='number'
              className='form-control'
              style={{ paddingLeft: '28px' }}
              placeholder='0'
              min={0}
              value={maximumSalary}
              onChange={(e) => {
                setMaximumSalary(e.target.value || '');
              }}
            ></input>
            <span
              style={{
                position: 'absolute',
                right: '30px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '16px',
                pointerEvents: 'none',
              }}
            >
              PHP
            </span>
          </div>

          <span style={{ fontSize: 16, color: '#181D27', fontWeight: 700 }}>
            Location
          </span>

          <span>Country</span>
          <CustomDropdown
            onSelectSetting={(setting) => {
              setCountry(setting);
            }}
            screeningSetting={country}
            settingList={[]}
            placeholder='Select Country'
          />

          <span>State / Province</span>
          <CustomDropdown
            onSelectSetting={(province) => {
              setProvince(province);
              const provinceObj = provinceList.find((p) => p.name === province);
              const cities = philippineCitiesAndProvinces.cities.filter(
                (city) => city.province === provinceObj.key
              );
              setCityList(cities);
              setCity(cities[0].name);
            }}
            screeningSetting={province}
            settingList={provinceList}
            placeholder='Select State / Province'
          />

          <span>City</span>
          <CustomDropdown
            onSelectSetting={(city) => {
              setCity(city);
            }}
            screeningSetting={city}
            settingList={cityList}
            placeholder='Select City'
          />
        </div>
      </div>
    </div>
  );
}
