type Props = { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }
export default function Toggle({ checked, onChange, disabled }: Props) {
  return (
    <label className={`inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <input 
        type="checkbox" 
        className="sr-only" 
        checked={checked} 
        onChange={e=>onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
        checked ? 'bg-success' : 'bg-gray-300'
      }`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`} />
      </span>
    </label>
  )
}
