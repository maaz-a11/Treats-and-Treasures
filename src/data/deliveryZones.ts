import type { DeliveryZone } from './orderTypes'

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'central',
    name: 'Central Karachi',
    areas: ['Saddar', 'Garden', 'Soldier Bazaar', 'Ranchore Lines', 'Lyari', 'Civil Lines'],
    deliveryFeePKR: 150,
    estimatedHours: '1–2 hours',
  },
  {
    id: 'south',
    name: 'South Karachi',
    areas: ['Defence (DHA)', 'Clifton', 'Bath Island', 'Boat Basin', 'Khayaban-e-Ittehad', 'Phase 1–8 DHA'],
    deliveryFeePKR: 200,
    estimatedHours: '1–3 hours',
  },
  {
    id: 'north',
    name: 'North Karachi',
    areas: ['North Karachi', 'Nazimabad', 'North Nazimabad', 'Federal B Area', 'Buffer Zone', 'New Karachi'],
    deliveryFeePKR: 200,
    estimatedHours: '2–4 hours',
  },
  {
    id: 'east',
    name: 'East Karachi',
    areas: ['Gulshan-e-Iqbal', 'Gulshan-e-Hadeed', 'Johar', 'Malir', 'Landhi', 'Model Colony'],
    deliveryFeePKR: 250,
    estimatedHours: '2–4 hours',
  },
  {
    id: 'west',
    name: 'West Karachi',
    areas: ['SITE', 'Baldia', 'Orangi Town', 'Korangi', 'Shah Faisal Colony'],
    deliveryFeePKR: 300,
    estimatedHours: '3–5 hours',
  },
  {
    id: 'gulberg',
    name: 'Gulberg / PECHS',
    areas: ['PECHS', 'Gulberg', 'Bahadurabad', 'Tariq Road', 'Shahrah-e-Faisal', 'Nursery'],
    deliveryFeePKR: 180,
    estimatedHours: '1–2 hours',
  },
  {
    id: 'fb-area',
    name: 'F.B Area / Gulshan',
    areas: ['Gulshan-e-Iqbal Blocks 1–19', 'F.B Area', 'Karimabad', 'Paposh Nagar'],
    deliveryFeePKR: 200,
    estimatedHours: '2–3 hours',
  },
]

export const TIME_SLOTS = [
  '10:00 AM – 12:00 PM',
  '12:00 PM – 2:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
  '6:00 PM – 8:00 PM',
]
