import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();

  return {
    push: (path) => navigate(path),
    replace: (path) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    pathname: location.pathname,
    query: { ...params, ...Object.fromEntries(searchParams.entries()) },
  };
}

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}
