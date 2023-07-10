function getHourOfDay(number: number, offset = 7) {
  const hour = (number + offset) % 24
  return `${hour}:00`
}

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

export function Summary() {
  return (
    <>
      <h1 className="px-3 text-gray-400 text-xs font-bold my-2">Schedule Summary</h1>
      <div className="w-80 px-3 pb-4 overflow-y-auto">
        {
          [...Array(24).keys()].map((v, i) => {
            const col = getRandomColor()
            return (
              <div key={`summary-item${i}`} className="flex mb-2 gap-2">
                <div className="[&_*]:text-gray-500">
                  <div className="w-8 text-right">
                    <p className="font-semibold text-xs">{getHourOfDay(i)}</p>
                  </div>
                </div>
                <div className="w-11/12 self-end rounded-md py-1.5 px-2 flex items-center bg-[#0f0f11] gap-2">
                  <div className={`border rounded-lg border-l-4 h-8`} style={{ borderColor: col }}/>
                  <section>
                    <p className="font-medium text-gray-300 text-sm">Meeting with team</p>
                  </section>
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}