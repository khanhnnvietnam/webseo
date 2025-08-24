import { SearchCheck } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-md">
      <SearchCheck className="h-8 w-8" />
    </div>
  );
}
