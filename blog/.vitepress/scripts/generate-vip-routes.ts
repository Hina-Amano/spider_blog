// .vitepress/scripts/generate-vip-routes.ts
// 生成 VIP 路由
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const docsDir = path.resolve(__dirname, '../../../blog_context')
const outputPath = path.resolve(__dirname, '../../../blog_context/public/vip-routes.json')

function walk(dir: string): string[] {
    const files: string[] = []
    for (const file of fs.readdirSync(dir)) {
        const full = path.join(dir, file)
        if (fs.statSync(full).isDirectory()) {
            files.push(...walk(full))
        } else if (file.endsWith('.md')) {
            files.push(full)
        }
    }
    return files
}

const vipRoutes: string[] = []

for (const file of walk(docsDir)) {
    const content = fs.readFileSync(file, 'utf-8')
    const { data } = matter(content)
    console.log(data)
    console.log(data.is_vip)

    if (data.is_vip) {
        // 把文件路径转成 URL 路径
        let route = file
            .replace(docsDir, '')
            .replace(/\\/g, '/')
            .replace(/\.md$/, '')
            .replace(/\/index$/, '/')

        // VitePress 默认加 .html 后缀
        if (!route.endsWith('/')) {
            route = route + '.html'
        }
        vipRoutes.push(route)
    }
}

// 确保这行在 writeFileSync 之前
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(vipRoutes, null, 2))

fs.writeFileSync(outputPath, JSON.stringify(vipRoutes, null, 2))
console.log(`✅ Generated vip-routes.json with ${vipRoutes.length} VIP routes:`, vipRoutes)