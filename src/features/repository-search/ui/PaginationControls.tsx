import styles from './PaginationControls.module.scss';

import { Button } from '@shared/ui/button';


interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  isLoading,
  onPrevious,
  onNext
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <Button
        type="button"
        variant="ghost"
        onClick={onPrevious}
        disabled={isLoading || currentPage <= 1}
      >
        Назад
      </Button>

      <span className={styles.info}>
        Страница {currentPage} из {totalPages}
      </span>

      <Button
        type="button"
        variant="ghost"
        onClick={onNext}
        disabled={isLoading || currentPage >= totalPages}
      >
        Вперед
      </Button>
    </div>
  );
}
