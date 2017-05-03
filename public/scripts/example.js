/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
//最内部的详细信息结构
var Comment = React.createClass({

  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="comment">
        <b className="commentAuthor">
          {this.props.author}：
        </b>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }

});
//包裹主要信息的大盒子
var CommentBox = React.createClass({

  //loadCommentsFromServer: function() {
  //  $.ajax({
  //    url: this.props.url,
  //    dataType: 'json',
  //    cache: false,
  //    success: function(data) {
  //      this.setState({data: data});
  //    }.bind(this),
  //    error: function(xhr, status, err) {
  //      console.error(this.props.url, status, err.toString());
  //    }.bind(this)
  //  });
  //},

  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    // Optimistically set an id on the new comment. It will be replaced by an
    // id generated by the server. In a production application you would likely
    // not use Date.now() for this and would have a more robust system in place.
    comment.id = Date.now();
    var newComments = comments.concat([comment]);//把多个数组连接成一个数组
    this.setState({data: newComments});
    //$.ajax({
    //  url: this.props.url,
    //  dataType: 'json',
    //  type: 'POST',
    //  data: comment,
    //  success: function(data) {
    //    this.setState({data: data});
    //  }.bind(this),
    //  error: function(xhr, status, err) {
    //    this.setState({data: comments});
    //    console.error(this.props.url, status, err.toString());
    //  }.bind(this)
    //});
  },

  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  render: function() {
    return (
      <div className="commentBox">
        <h1>参与评论</h1>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <CommentList data={this.state.data} />
      </div>
    );
  }

});


//大盒子下面所提交的表单信息
var CommentForm = React.createClass({

  getInitialState: function() {
    return {author: '', text: ''};
  },

  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },

  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();//trim()去除文本两边的空白
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },

  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          className="userName"
          type="text"
          placeholder="用户名"
          value={this.state.author}
          onChange={this.handleAuthorChange}
          />
        <textarea
          name="content"
          value={this.state.text}
          placeholder="说点什么吧..."
          onChange={this.handleTextChange}
          ></textarea>
        <input className="submit_button" type="submit" value="畅言一下"/>
      </form>
    );
  }

});

//大盒子中的一条条信息
var CommentList = React.createClass({

  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }

});



ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={20000} />,
  document.getElementById('content')
);
