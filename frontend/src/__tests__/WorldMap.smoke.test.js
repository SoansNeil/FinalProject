jest.mock('react-leaflet', () => ({ MapContainer: () => null, TileLayer: () => null, Popup: () => null, CircleMarker: () => null, GeoJSON: () => null }));
jest.mock('leaflet', () => ({}));
jest.mock('axios', () => ({ create: () => ({ interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }, get: jest.fn(), post: jest.fn() }) }));
import { render } from '@testing-library/react';
import WorldMap from '../pages/WorldMap';

describe('WorldMap', () => {
  test('renders without crashing', () => {
    render(<WorldMap />);
  });
});
