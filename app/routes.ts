import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/results/:id', 'routes/results.tsx'),
    route('/resume/:id', 'routes/results.tsx', { id: 'resume-results' }),
] satisfies RouteConfig;
