import type { BlogPost } from '../../types/Blog';
import './BlogCards.css';

type BlogCardsProps = {
    post: BlogPost;
};

function BlogCards({ post }: BlogCardsProps) {
    return (
        <article
            className="blog-card"
            role="listitem"
            aria-label={post.title}
            data-blog-slug={post.slug}
        >
            <div className="blog-card__media-wrap">
                <img
                    className="blog-card__media"
                    src={post.image}
                    alt={post.title}
                />
            </div>
            <div className="blog-card__body">
                <div className="blog-card__meta-row">
                    <p className="blog-card__author">{post.author}</p>
                    <p className="blog-card__date">{post.date}</p>
                </div>
                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__description">{post.description}</p>
            </div>
        </article>
    );
}

export default BlogCards;
