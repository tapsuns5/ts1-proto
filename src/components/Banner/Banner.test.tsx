import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Banner } from './Banner';
import { BannerProps } from './Banner.types';

describe('Banner', () => {
  let props: BannerProps;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('should display text', () => {
    props = {
      title: 'title text',
      testId: 'banner',
    };
    const { getByTestId } = render(<Banner {...props} />);
    const bannerComponent = getByTestId('banner');
    expect(bannerComponent).toHaveTextContent('title text');
  });

  describe('Timer functionality', () => {
    it('should render timer when timer prop is provided', () => {
      props = {
        caption: 'Timer banner',
        timer: 30000, // 30 seconds
        testId: 'banner',
      };
      render(<Banner {...props} />);

      expect(screen.getByTestId('banner--timer-container')).toBeInTheDocument();
      expect(screen.getByTestId('banner--timer')).toBeInTheDocument();
    });

    it('should not render icon when timer is present', () => {
      props = {
        caption: 'Timer banner',
        timer: 30000,
        testId: 'banner',
      };
      render(<Banner {...props} />);

      expect(screen.queryByTestId('banner--icon-container')).not.toBeInTheDocument();
    });

    it('should display timer in "Xs" format for durations under 60 seconds', () => {
      props = {
        caption: 'Timer banner',
        timer: 25000, // 25 seconds
        testId: 'banner',
      };
      render(<Banner {...props} />);

      expect(screen.getByTestId('banner--timer')).toHaveTextContent('25s');
    });

    it('should display timer in "Xm Ys" format for durations over 60 seconds', () => {
      props = {
        caption: 'Timer banner',
        timer: 150000, // 2 minutes 30 seconds
        testId: 'banner',
      };
      render(<Banner {...props} />);

      expect(screen.getByTestId('banner--timer')).toHaveTextContent('2m 30s');
    });

    it('should countdown timer correctly', async () => {
      props = {
        caption: 'Timer banner',
        timer: 5000, // 5 seconds
        testId: 'banner',
      };
      render(<Banner {...props} />);

      expect(screen.getByTestId('banner--timer')).toHaveTextContent('5s');

      // Advance by 1 second
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
      await waitFor(() => {
        expect(screen.getByTestId('banner--timer')).toHaveTextContent('4s');
      });

      // Advance by another 2 seconds
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => {
        expect(screen.getByTestId('banner--timer')).toHaveTextContent('2s');
      });
    });

    it('should stop timer at "0s"', async () => {
      props = {
        caption: 'Timer banner',
        timer: 2000, // 2 seconds
        testId: 'banner',
      };
      render(<Banner {...props} />);

      expect(screen.getByTestId('banner--timer')).toHaveTextContent('2s');

      // Advance to completion
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });
      await waitFor(() => {
        expect(screen.getByTestId('banner--timer')).toHaveTextContent('0s');
      });

      // Verify it stays at 0s
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => {
        expect(screen.getByTestId('banner--timer')).toHaveTextContent('0s');
      });
    });

    it('should render icon when hideIcon is false and timer is not provided', () => {
      props = {
        caption: 'Banner with icon',
        hideIcon: false,
        testId: 'banner',
      };
      render(<Banner {...props} />);

      expect(screen.getByTestId('banner--icon-container')).toBeInTheDocument();
      expect(screen.queryByTestId('banner--timer-container')).not.toBeInTheDocument();
    });

    it('should not render icon when hideIcon is true', () => {
      props = {
        caption: 'Banner without icon',
        hideIcon: true,
        testId: 'banner',
      };
      render(<Banner {...props} />);

      expect(screen.queryByTestId('banner--icon-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('banner--timer-container')).not.toBeInTheDocument();
    });

    it('should render action TextLink when action.label is provided', () => {
      props = {
        caption: 'Banner with action',
        action: {
          label: 'Edit score',
          onClick: jest.fn(),
        },
        testId: 'banner',
      };
      render(<Banner {...props} />);

      expect(screen.getByText('Edit score')).toBeInTheDocument();
      expect(screen.getByTestId('banner--content-actions')).toBeInTheDocument();
    });

    it('should render action IconButton when action has no label', () => {
      props = {
        caption: 'Banner with action no label',
        action: {
          onClick: jest.fn(),
        },
        testId: 'banner',
      };
      render(<Banner {...props} />);

      expect(screen.getByTestId('banner--content-actions')).toBeInTheDocument();
    });

    it('should format timer transition from minutes to seconds correctly', async () => {
      props = {
        caption: 'Timer banner',
        timer: 61000, // 1 minute 1 second
        testId: 'banner',
      };
      render(<Banner {...props} />);

      expect(screen.getByTestId('banner--timer')).toHaveTextContent('1m 1s');

      // Advance by 2 seconds to go below 1 minute
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => {
        expect(screen.getByTestId('banner--timer')).toHaveTextContent('59s');
      });
    });
  });
});
