import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the repository mapping file
pic_task_repos_df = pd.read_csv('pic-task-repos.csv')

# Define the specific PIC repositories to plot and their display names
target_pic_repos = {
    'operations/puppet': 'Puppet PIC',
    'operations/mediawiki-config': 'Mediawiki-config PIC',
    'mediawiki/core': 'Mediawiki Core PIC'
}

# List to hold dataframes for concatenation
dfs_to_concat = []

# Add OC tasks to the list. Use .copy() to ensure we are working with a separate DataFrame
dfs_to_concat.append(closed_oc_tasks.copy())
dfs_to_concat.append(closed_pic_tasks.copy())

# Keep track of all task IDs that are part of the 'specific' PIC repos
all_specific_pic_task_ids = set()

# Process each target PIC repository
for repo_name, display_name in target_pic_repos.items():
    # Filter pic_task_repos_df for the current repository to get relevant task IDs
    current_repo_task_ids = pic_task_repos_df[pic_task_repos_df['repo'] == repo_name]['taskId']
    all_specific_pic_task_ids.update(current_repo_task_ids)

    # Filter closed_pic_tasks for these specific task IDs and create a copy
    repo_specific_pic_tasks = closed_pic_tasks[closed_pic_tasks['id'].isin(current_repo_task_ids)].copy()

    # Assign the custom source label for plotting
    repo_specific_pic_tasks['source'] = display_name

    # Add to the list for concatenation
    dfs_to_concat.append(repo_specific_pic_tasks)

# Create the 'Other PIC' category
# First, get all task IDs from the original closed_pic_tasks
all_pic_task_ids = set(closed_pic_tasks['id'])

# Determine 'Other PIC' task IDs by subtracting specific ones
other_pic_task_ids = list(all_pic_task_ids - all_specific_pic_task_ids)

# Filter closed_pic_tasks for these 'Other PIC' IDs
other_pic_tasks_df = closed_pic_tasks[closed_pic_tasks['id'].isin(other_pic_task_ids)].copy()
other_pic_tasks_df['source'] = 'Other PIC'

# Add 'Other PIC' to the list for concatenation
dfs_to_concat.append(other_pic_tasks_df)

# Combine all dataframes into sampled_tasks for plotting
sampled_tasks = pd.concat(dfs_to_concat)

# Figures that will go in the paper

plt.figure(figsize=(5.45, 4.1))
sns.ecdfplot(data=sampled_tasks, x='numActivity', hue='source')
#plt.title(f'ECDF of Task Activity')
plt.xlabel('Activity')
plt.ylabel('Cumulative Probability')
plt.grid(True, linestyle='--', alpha=0.7)
plt.show()

