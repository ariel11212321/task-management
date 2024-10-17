import ToggleSwitch from "./ToggleSwitch";

  
  
  const SettingItem = ({ icon, title, description, setting, settings, setSettings }) => {

    const handleToggle = (setting) => {
        setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    };
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center">
        {icon}
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <ToggleSwitch checked={settings[setting]} onChange={() => handleToggle(setting)} />
    </div>
    );
}


  export default SettingItem; 