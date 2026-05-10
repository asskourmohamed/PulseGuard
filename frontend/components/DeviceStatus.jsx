export const DeviceStatus = ({ devices }) => {
  if (!devices || devices.length === 0) return null;

  const device = devices[0];
  const isOnline = device.status === 'online';

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#13172a] border border-[#1e2235]">
      <div
        className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
      />
      <span className="text-xs font-medium text-gray-300">
        {device.device_id}
      </span>
      <span className="text-xs text-gray-500">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};
