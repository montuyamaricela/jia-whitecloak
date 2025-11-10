'use client';

import React from 'react';
import HeaderBar from '@/lib/PageComponent/HeaderBar';
import CareerForm from '@/lib/components/CareerComponents/CareerForm/CareerForm';
import CareerFormOLD from '@/lib/components/CareerComponents/CareerForm/CareerFormOld';

export default function NewCareerPage() {
  return (
    <>
      <HeaderBar
        activeLink='Careers'
        currentPage='Add new career'
        icon='la la-suitcase'
      />
      <div className='container-fluid mt--7' style={{ paddingTop: '6rem' }}>
        <div className='row'>
          <CareerForm formType='add' />
          {/* <CareerFormOLD formType='add' /> */}
        </div>
      </div>
    </>
  );
}
