import RichTextEditor from '@/lib/components/CareerComponents/RichTextEditor';

export default function CareerInformationCard({
  jobTitle,
  setJobTitle,
  description,
  setDescription,
}: {
  jobTitle: string;
  setJobTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
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
              className='la la-suitcase'
              style={{ color: '#FFFFFF', fontSize: 20 }}
            ></i>
          </div>
          <span style={{ fontSize: 16, color: '#181D27', fontWeight: 700 }}>
            Career Information
          </span>
        </div>
        <div className='layered-card-content'>
          <span>Job Title</span>
          <input
            value={jobTitle}
            className='form-control'
            placeholder='Enter job title'
            onChange={(e) => {
              setJobTitle(e.target.value || '');
            }}
          ></input>
          <span>Description</span>
          <RichTextEditor setText={setDescription} text={description} />
        </div>
      </div>
    </div>
  );
}
