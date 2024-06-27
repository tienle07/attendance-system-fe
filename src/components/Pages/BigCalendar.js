import React, { useEffect } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
let calendar = ''
function BigCalendar(props) {
  const { obj,start } = props;
  calendar = [
    // {
    //   title: "Morning Shiff",
    //   start: "2023-10-16T03:00:00+02:00",
    //   end: "2023-10-16T12:00:00+02:00"
    // },
    // {
    //   title: " Shiff",
    //   start: "2023-10-16T06:00:00+02:00",
    //   end: "2023-10-16T16:00+02:00",
    //   description: 'Lecture'

    // },
    // {
    //   title: "Night Shiff",
    //   start: "2023-10-16T09:00:00+02:00",
    //   end: "2023-10-16T15:00:00+02:00",
    //   description: 'Lecture'
    // },
    // {
    //   title: "Night Shiff",
    //   start: "2023-10-17T09:00:00+02:00",
    //   end: "2023-10-17T15:00:00+02:00",
    //   description: 'Lecture'

    // }
  ]
  let test = obj?.map((d, i) => {
    return {
      title: d.shiftName,
      start: d.startTime,
      end: d.endTime
    }
  })
  useEffect(() => {
    console.log(test)
  }, []);
  return (
    <div className="card">
      <div className="py-3 px-3">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          selectable={true}
          headerToolbar={{
            start: 'title', // will normally be on the left. if RTL, will be on the right
            center: '',
            end: ''
          }}
          editable={false}
          initialView="timeGridWeek"
          // eventDrop={}
          // eventClick={}
          // events='https://fullcalendar.io/api/demo-feeds/events.json?overload-day&start=2023-10-01T00%3A00%3A00Z&end=2023-11-12T00%3A00%3A00Z&timeZone=UTC'
          events={test}
          eventBackgroundColor='#D8FBCB'
          allDaySlot={false}
          initialDate={start}
          firstDay={1}

          select={function (info) {
            alert('selected ' + info.startStr + ' to ' + info.endStr + ' on resource ' + info);
          }}
        />
      </div>
    </div>
  );
}


export default BigCalendar;