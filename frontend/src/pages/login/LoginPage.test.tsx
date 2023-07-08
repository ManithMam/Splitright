import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import LoginPage from './LoginPage';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';

jest.mock('./LoginPage.css', () => ({}));

const server = setupServer(
  rest.post('http://localhost:3000/auth/login', (req, res, ctx) => {
    return res(ctx.json({
        token: "123",
    }));
  }),

  rest.get('http://localhost:3000/games', (req, res, ctx) => {
    return res(ctx.json([]));
  }),
);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

beforeAll(() => {
    server.listen()
    global.fetch = jest.fn();
    fetchMock.enableMocks();
});
afterEach(() => {
    server.resetHandlers();
    jest.resetAllMocks();
  });
  afterAll(() => {
    server.close();
  });

test('renders login form and submits values', async () => {
  const setIsLoggendIn = jest.fn();
  const { getByLabelText, getByText } = render(
    <Router>
      <LoginPage setIsLoggendIn={setIsLoggendIn} />
    </Router>
  );

  fireEvent.change(getByLabelText(/username/i), {
    target: { value: 'testUser' },
  });

  fireEvent.change(getByLabelText(/password/i), {
    target: { value: 'testPassword' },
  });

  (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => ({ token: 'testToken' }) });

  fireEvent.click(getByText(/login/i));

  await waitFor(() => expect(setIsLoggendIn).toHaveBeenCalledTimes(1))

});

test('shows error when username and password fields are left empty', async () => {
  const setIsLoggendIn = jest.fn();
  const { getByText, findByText } = render(
    <Router>
      <LoginPage setIsLoggendIn={setIsLoggendIn} />
    </Router>
  );

  fireEvent.click(getByText(/login/i));

  const usernameError = await findByText(/Username cannot be empty/i);
  expect(usernameError).toBeInTheDocument();

  const passwordError = await findByText(/Password cannot be empty/i);
  expect(passwordError).toBeInTheDocument();
});

test('shows error when username or password is incorrect', async () => {
  server.use(
    rest.post('http://localhost:3000/auth/login', (req, res, ctx) => {
      return res(ctx.status(401), ctx.json({ message: 'Incorrect username or password' }));
    }),
  );

  const setIsLoggendIn = jest.fn();
  const { getByLabelText, getByText, findByText } = render(
    <Router>
      <LoginPage setIsLoggendIn={setIsLoggendIn} />
    </Router> 
  );

  fireEvent.change(getByLabelText(/username/i), {
    target: { value: 'wrongUser' },
  });

  fireEvent.change(getByLabelText(/password/i), {
    target: { value: 'wrongPassword' },
  });

  fireEvent.click(getByText(/login/i));

  const errorMessage = await findByText(/Wrong username or password/i);
  expect(errorMessage).toBeInTheDocument();

  // Click the Snackbar to close it
  fireEvent.click(getByLabelText("Close"));

  expect(errorMessage).toBeNull;
});

test('username and password are initially empty', () => {
  const setIsLoggendIn = jest.fn();
  const { getByLabelText } = render(
    <Router>
      <LoginPage setIsLoggendIn={setIsLoggendIn} />
    </Router>
  );
  
  expect(getByLabelText(/username/i)).toHaveValue('');
  expect(getByLabelText(/password/i)).toHaveValue('');
});

test('displays error messages when username or password are empty', async () => {
  const setIsLoggendIn = jest.fn();
  const { getByText, queryByText } = render(
    <Router>
      <LoginPage setIsLoggendIn={setIsLoggendIn} />
    </Router>
  );

  fireEvent.click(getByText(/login/i));

  await waitFor(() => {
    expect(queryByText(/Username cannot be empty/i)).toBeInTheDocument();
    expect(queryByText(/Password cannot be empty/i)).toBeInTheDocument();
  });
});