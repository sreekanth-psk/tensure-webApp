# Image assets

Source and reference images for the Tensure web app.

## Structure

```
assets/images/insights/   → copies of insight card art (source archive)
public/images/insights/ → served by Next.js at /images/insights/*
```

When adding new images, place files in `public/images/insights/` and optionally mirror them here for documentation.

## Insight card images

| File | Usage | Topic |
|------|--------|--------|
| `devops-pipeline-corridor.png` | Latest Insights card 1 | CI/CD pipeline & deployment lanes |
| `platform-control-center.png` | Latest Insights card 2 | Platform engineering dashboards |
| `cloud-logistics-hub.png` | Latest Insights card 3 | Cloud logistics & global delivery |
| `financial-security-monitoring.png` | Latest Insights card 4 | Security & compliance monitoring |

## Hero / 3D references

Additional reference images from design sessions may live in the Cursor assets folder. The live hero uses the procedural Three.js deployment corridor in `src/components/three/`.
