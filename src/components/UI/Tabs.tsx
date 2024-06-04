
export function Tabs({ tabs, activeIndex, onTabChange }: { tabs: String[], activeIndex: number, onTabChange: Function }) {
  return <div className="flex border-gray-300">
    {
      tabs.map((tab, index) => {
        return <div
          key={index}
          className={`border-b-2 text-sm py-2 px-4 cursor-pointer ${index === activeIndex ? 'border-blue-500 font-medium' : 'text-gray-400 font-light'}`}
          onClick={() => onTabChange(index)}
        >
          {tab}
        </div>
      })
    }
  </div>
}
