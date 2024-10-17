const ToggleSwitch = ({ checked, onChange }) => (
    <div 
      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}
      onClick={onChange}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-4' : ''}`} />
    </div>
  );

export default ToggleSwitch;